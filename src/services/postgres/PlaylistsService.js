const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapPlaylistDBToModel } = require('../../utils/playlistModel');
const { mapMusicDBToModel } = require('../../utils/musicModel');
const { mapActivitiesBToModel } = require('../../utils/activitiesModel');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addSongToPlaylists(playlistId,songId,owner) {
    await this.verifyPlaylistAccess(playlistId,owner)

    const resultSong = await this._pool.query("SELECT * FROM songs WHERE id = $1",[songId]);
    if (!resultSong.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }else{
      const id = nanoid(16);
      const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id,playlistId,songId],
    };

    const activitiesId = nanoid(16);
    const createdAt = new Date().toISOString();
    const queryAct = {
    text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4,$5,$6) RETURNING id',
    values: [activitiesId,playlistId,songId,owner,'add',createdAt],
    }

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }else{
      await this._pool.query(queryAct);
    }

    return result.rows[0].id;
    }
  }

  async addPlaylists({ name, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner){

    const result = await this._pool.query(`SELECT
    playlists."id", 
    playlists."name", 
    users.username
  FROM
    playlists
    INNER JOIN
    users
    ON 
      playlists."owner" = users."id"
  WHERE
    playlists."owner" =  $1`,[owner]);

    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    return result.rows.map(mapPlaylistDBToModel)
  }

  async getPlaylistsById(id,owner) {
    await this.verifyPlaylistAccess(id,owner)

    const queryMusic = {
      text: `SELECT
      playlists."id" as playlistid, 
      playlists."name", 
      songs."id", 
      songs.title, 
      songs.performer, 
      users.username
    FROM
      playlists
      INNER JOIN
      playlist_songs
      ON 
        playlists."id" = playlist_songs.playlist_id
      INNER JOIN
      songs
      ON 
        playlist_songs.song_id = songs."id"
      INNER JOIN
      users
      ON 
        playlists."owner" = users."id"
    WHERE
      playlists."id" =  $1`,
      values: [id],
    };
    const resultMusic = await this._pool.query(queryMusic);
    if (!resultMusic.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const res = {
      "playlist": {
        "id": resultMusic.rows[0].playlistid,
        "name": resultMusic.rows[0].name,
        "username": resultMusic.rows[0].username,
        "songs": resultMusic.rows.map(mapMusicDBToModel)
      }
    };

    return res;
  }

  async deleteSongPlaylistsById(id, songId, owner) {
    await this.verifyPlaylistAccess(id,owner)

    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }else{
      const activitiesId = nanoid(16);
      const createdAt = new Date().toISOString();
      const queryAct = {
        text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4,$5,$6) RETURNING id',
        values: [activitiesId,id,songId,owner,'delete',createdAt],
        }
      await this._pool.query(queryAct);
    }
  }
  async deletePlaylistsById(id, owner) {
    await this.verifyPlaylistAccess(id,owner)

    await this._pool.query('DELETE FROM playlist_songs WHERE playlist_id = $1 RETURNING id',[id]);
    await this._pool.query('DELETE FROM playlist_song_activities WHERE playlist_id = $1 RETURNING id',[id]);
    const result = await this._pool.query('DELETE FROM playlists WHERE id = $1 RETURNING id',[id]);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async getActivitiesById(id,owner) {
    await this.verifyPlaylistAccess(id,owner)

    const queryAct = {
      text: `SELECT
      playlist_song_activities.playlist_id, 
      users.username, 
      songs.title, 
      playlist_song_activities."action", 
      playlist_song_activities."time"
    FROM
      playlist_song_activities
      INNER JOIN
      songs
      ON 
        playlist_song_activities.song_id = songs."id"
      INNER JOIN
      users
      ON 
        playlist_song_activities.user_id = users."id"
    WHERE
      playlist_song_activities.playlist_id =  $1`,
      values: [id],
    };
    const resultAct = await this._pool.query(queryAct);
    if (!resultAct.rows.length) {
      throw new NotFoundError('Aktivitas tidak ditemukan');
    }

    const res = {
      "playlistId" : resultAct.rows[0].playlist_id,
      "activities":  resultAct.rows.map(mapActivitiesBToModel)
    };

    return res;
  }

}

module.exports = PlaylistsService;
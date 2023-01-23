const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapPlaylistDBToModel } = require('../../utils/playlistModel');
const { mapMusicDBToModel } = require('../../utils/musicModel');
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

    const resultSong = await this._pool.query("SELECT * FROM song WHERE id = $1",[songId]);
    if (!resultSong.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }else{
      const id = nanoid(16);
      const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id,playlistId,songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
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
      song."id", 
      song.title, 
      song.performer, 
      users.username
    FROM
      playlists
      INNER JOIN
      playlist_songs
      ON 
        playlists."id" = playlist_songs.playlist_id
      INNER JOIN
      song
      ON 
        playlist_songs.song_id = song."id"
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

  async editPlaylistsById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE playlists SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Playlists. Id tidak ditemukan');
    }
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
    }
  }
  async deletePlaylistsById(id, owner) {
    await this.verifyPlaylistAccess(id,owner)

    await this._pool.query('DELETE FROM playlist_songs WHERE playlist_id = $1 RETURNING id',[id]);

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
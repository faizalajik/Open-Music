const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapPlaylistDBToModel } = require('../../utils/playlistModel');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistAccess(noteId, userId) {
    try {
      await this.verifyPlaylistOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addSongToPlaylists(id,songId) {

    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1,$2) RETURNING id',
      values: [id,songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
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

    const result = await this._pool.query("SELECT id, name, owner as username FROM playlists WHERE owner = $1",[owner]);

    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    return result.rows.map(mapPlaylistDBToModel)
  }

  async getPlaylistsById(id) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const queryMusic = {
      text: 'SELECT id,title,performer FROM song WHERE "playlistsId" = $1',
      values: [id],
    };
    const resultMusic = await this._pool.query(queryMusic);
    if (!result.rows.length) {
      throw new NotFoundError('Playlists tidak ditemukan');
    }
    const res = {
      "Playlists": {
        "id": result.rows[0].id,
        "name": result.rows[0].name,
        "year": result.rows[0].year,
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

  async deletePlaylistsById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlists gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
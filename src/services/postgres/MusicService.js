const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapMusicDBToModel } = require('../../utils/musicModel');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class MusicService {
  constructor() {
    this._pool = new Pool();
  }

  async addMusic({ title, year, performer, genre, duration, albumId }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Music gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getMusic(title = '', performer = '') {
    var result = '';

    if (title != '' && performer != '') {
      result = await this._pool.query("SELECT id, title, performer FROM song where (lower(title) LIKE '%'||$1||'%' AND lower(performer) LIKE '%'||$2||'%')", [title, performer]);
    }
    else if (performer != '') {
      result = await this._pool.query("SELECT id, title, performer FROM song where LOWER(performer) LIKE '%'||$1||'%'", [performer]);
    }
    else if (title != '') {
      result = await this._pool.query("SELECT id, title, performer FROM song where LOWER(title) LIKE '%'||$1||'%'", [title]);
    }
    else {
      result = await this._pool.query('SELECT id, title, performer FROM song');
    }

    return result.rows.map(mapMusicDBToModel);
  }

  async getMusicById(id) {

    const result = await this._pool.query('SELECT * FROM song WHERE id = $1', [id]);

    if (!result.rows.length) {
      throw new NotFoundError('Music tidak ditemukan');
    }

    return result.rows.map(mapMusicDBToModel)[0];
  }

  async editMusicById(id, { title, year, performer, genre, duration, albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "albumId" = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui musid. Id tidak ditemukan');
    }
  }

  async deleteMusicById(id) {
    const query = {
      text: 'DELETE FROM song WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Music gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = MusicService;
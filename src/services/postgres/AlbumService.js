const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapMusicDBToModel } = require('../../utils/musicModel');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async likeAlbum(userId, albumId) {
    var message = ''
    var query = ''
    const cekLikes = await this._pool.query(
      `SELECT * FROM user_album_likes WHERE user_id = $1 and album_id = $2`
      ,[userId, albumId])
    if(!cekLikes.rows.length){
      const id = nanoid(16);

       query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };
      message = 'Like Berhasil Di Tambahkan'
    }else{
     query = {
        text: 'DELETE FROM user_album_likes WHERE id = $1 RETURNING id',
        values: [cekLikes.rows[0].id],
      };
      message = 'Like Berhasil Di Dihapus'

    }

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    return message;
  }

  async getAlbumLikeById(id) {
    const query = {
      text: `SELECT
        count(user_album_likes.album_id) as jumlah
      FROM
        user_album_likes
      WHERE
        user_album_likes.album_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('albums tidak ditemukan');
    }
    const res = {'likes' : parseInt(result.rows[0].jumlah)}

    return res;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const queryMusic = {
      text: 'SELECT id,title,performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const resultMusic = await this._pool.query(queryMusic);
    if (!result.rows.length) {
      throw new NotFoundError('albums tidak ditemukan');
    }
    const res = {
      "album": {
        "id": result.rows[0].id,
        "name": result.rows[0].name,
        "year": result.rows[0].year,
        "coverUrl": result.rows[0].cover,
        "songs": resultMusic.rows.map(mapMusicDBToModel)
      }
    };

    return res;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }
  async editCoverAlbumById(id, { fileLocation }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [fileLocation,id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
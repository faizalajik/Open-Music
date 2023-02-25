/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('songs', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      title: {
        type: 'VARCHAR(255)',
        notNull: true,
      },
      year: {
        type: 'INTEGER',
        notNull: true,
      },
      performer: {
        type: 'VARCHAR(255)',
        notNull: true,
      },
      genre: {
        type: 'VARCHAR(255)',
        notNull: true,
      },
      duration: {
        type: 'INTEGER',
        notNull: false,
      },
      albumId: {
        type: 'VARCHAR(50)',
        notNull: false,
      },
      created_at: {
        type: 'TEXT',
        notNull: true,
      },
      updated_at: {
        type: 'TEXT',
        notNull: true,
      },
    });
  pgm.addConstraint('songs', 'fk_albumId.albumId_albums_id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');

  };

exports.down = pgm => {
pgm.dropTable('songs');
};

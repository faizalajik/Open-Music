/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('playlists', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      name: {
        type: 'VARCHAR(255)',
        notNull: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
    });
  pgm.addConstraint('playlists', 'fk_owner.owner_user_id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  };

  exports.down = (pgm) => {
    pgm.dropTable('playlists');
  };

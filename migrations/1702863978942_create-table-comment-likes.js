exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'SERIAL',
      primaryKey: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};

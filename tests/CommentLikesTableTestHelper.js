/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async likeComment({
    commentId = 'comment-123', userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes ("commentId", "userId") VALUES ($1, $2)',
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async unlikeComment({
    commentId = 'comment-123', userId = 'user-123',
  }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE "commentId" = $1 AND "userId" = $2',
      values: [commentId, userId],
    };

    await pool.query(query);
  },

  async findLikes(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE "commentId" = $1 AND "userId" = $2',
      values: [commentId, userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;

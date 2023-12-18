const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComments');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT a.id, b.username, a."createdAt" as date, a."isDelete", a.content
        FROM comments as a
        JOIN users as b ON b.id = a."userId"
        WHERE "threadId" = $1
        ORDER BY a."createdAt" ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailComment(row));
  }

  async addComment(comment) {
    const { threadId, userId, content } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, "threadId", "userId", content) VALUES($1, $2, $3, $4) RETURNING id, content, "userId" as owner',
      values: [id, threadId, userId, content],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async verifyCommentExists(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment not found');
    }
  }

  async verifyCommentOwner(id, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND "userId" = $2',
      values: [id, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak berhak memanipulasi komentar');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET "isDelete" = TRUE WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment not found');
    }
  }

  async isLikedComment(id, userId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE "commentId" = $1 AND "userId" = $2',
      values: [id, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async likeComment(id, userId) {
    const query = {
      text: 'INSERT INTO comment_likes ("commentId", "userId") VALUES($1, $2)',
      values: [id, userId],
    };

    await this._pool.query(query);
  }

  async unlikeComment(id, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE "commentId" = $1 AND "userId" = $2',
      values: [id, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;

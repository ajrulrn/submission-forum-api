const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedReply = require('../../Domains/replies/entities/CreatedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
        SELECT a.id, a.content, a."createdAt" as date, a."isDelete", b.username
        FROM replies as a
        JOIN users as b ON b.id = a."userId"
        WHERE a."commentId" = $1
        ORDER BY a."createdAt" ASC
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailReply(row));
  }

  async addReply(reply) {
    const { commentId, content, userId } = reply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies (id, "commentId", "userId", content) VALUES($1, $2, $3, $4) RETURNING id, content, "userId" as owner',
      values: [id, commentId, userId, content],
    };

    const result = await this._pool.query(query);

    return new CreatedReply({ ...result.rows[0] });
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET "isDelete" = TRUE WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply not found');
    }
  }

  async verifyReplyExists(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply not found');
    }
  }

  async verifyReplyOwner(id, userId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND "userId" = $2',
      values: [id, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('kamu tidak berhak memanipulasi balasan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;

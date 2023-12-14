const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getRepliesByCommentId function', () => {
    it('should return empty if no have replies', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('xxx');

      expect(replies).toHaveLength(0);
    });

    it('should return replies correctly', async () => {
      const userPayload = {
        id: 'user-123',
        username: 'dicoding',
      };
      const replyPayload = {
        id: 'reply-123',
        commentId: 'comment-123',
        content: 'sebuah balasan',
        userId: userPayload.id,
      };
      await UsersTableTestHelper.addUser(userPayload);
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123' });
      await RepliesTableTestHelper.addReply(replyPayload);

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const [reply] = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

      expect(reply.id).toEqual(replyPayload.id);
      expect(reply.content).toEqual(replyPayload.content);
      expect(reply.date.getDate()).toEqual(new Date().getDate());
      expect(reply.isDelete).toEqual(false);
      expect(reply.username).toEqual(userPayload.username);
    });
  });

  describe('addReply function', () => {
    it('should persist create reply and return created reply correctly', async () => {
      const newReply = new NewReply({
        commentId: 'comment-123',
        userId: 'user-123',
        content: 'balasan',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(newReply);

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      const newReply = new NewReply({
        commentId: 'comment-123',
        userId: 'user-123',
        content: 'balasan',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const createdReply = await replyRepositoryPostgres.addReply(newReply);

      expect(createdReply).toStrictEqual(new CreatedReply({
        id: 'reply-123',
        content: 'balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.deleteReply('xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should persist isDelete to true', async () => {
      const userPayload = {
        id: 'user-1234',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        threadId,
        commentId,
        userId: userPayload.id,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply(replyId);

      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].isDelete).toEqual(true);
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyExists('xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not return exception when reply found', async () => {
      const userPayload = {
        id: 'user-1234',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        threadId,
        commentId,
        userId: userPayload.id,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyExists(replyId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when is not author of reply', async () => {
      const userPayload = {
        id: 'user-1234',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        threadId,
        commentId,
        userId: userPayload.id,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('xxx')).rejects.toThrowError(AuthorizationError);
    });

    it('should not return exception when reply has authorize', async () => {
      const userPayload = {
        id: 'user-1234',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        threadId,
        commentId,
        userId: userPayload.id,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, userPayload.id))
        .resolves.not.toThrow(AuthorizationError);
    });
  });
});

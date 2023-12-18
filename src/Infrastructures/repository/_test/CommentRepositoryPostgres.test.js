const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComments');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getCommentsByThreadId function', () => {
    it('should return empty if no have comments', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('xxx');

      expect(comments).toHaveLength(0);
    });

    it('should return comments correctly', async () => {
      const userPayload = {
        id: 'user-123',
        username: 'dicoding',
      };
      const commentPayload = {
        id: 'comment-123',
        threadId: 'thread-123',
        content: 'sebuah konten',
        userId: userPayload.id,
        date: new Date(),
      };
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({
        id: commentPayload.threadId,
        userId: commentPayload.userId,
      });
      await CommentsTableTestHelper.addComment(commentPayload);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const [comment] = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comment.id).toEqual(commentPayload.id);
      expect(comment.username).toEqual(userPayload.username);
      expect(comment.date.getDate()).toEqual(commentPayload.date.getDate());
      expect(comment.isDelete).toEqual(false);
      expect(comment.content).toEqual(commentPayload.content);
    });
  });

  describe('addComment function', () => {
    it('should persist create comment and return created reply correctly', async () => {
      const newComment = new NewComment({
        threadId: 'thread-123',
        userId: 'user-123',
        content: 'sebuah konten',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(newComment);

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      const newComment = new NewComment({
        threadId: 'thread-123',
        userId: 'user-123',
        content: 'sebuah konten',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const createdComment = await commentRepositoryPostgres.addComment(newComment);

      expect(createdComment).toStrictEqual(new CreatedComment({
        id: 'comment-123',
        content: 'sebuah konten',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteComment('xxx')).rejects.toThrowError(NotFoundError);
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
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment(commentId);

      const comments = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comments).toHaveLength(1);
      expect(comments[0].isDelete).toEqual(true);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExists('xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not return exception when comment was found', async () => {
      const userPayload = {
        id: 'user-1234',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExists(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when is not author of comment', async () => {
      const userPayload = {
        id: 'user-12345',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'xxx')).rejects.toThrowError(AuthorizationError);
    });

    it('should not return exception when comment has authorize', async () => {
      const userPayload = {
        id: 'user-12356',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, userId: userPayload.id });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userPayload.id))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('isLikedComment function', () => {
    it('should return false when comment is not liked', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const isLikedComment = await commentRepositoryPostgres.isLikedComment('comment-123', 'user-123');

      expect(isLikedComment).toBe(false);
    });

    it('should return true when comment is liked', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ threadId: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
      await CommentLikesTableTestHelper.likeComment({ commentId: 'comment-123', userId: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const isLikeComment = await commentRepositoryPostgres.isLikedComment('comment-123', 'user-123');

      expect(isLikeComment).toBe(true);
    });
  });

  describe('likeComment function', () => {
    it('should persist create comment like', async () => {
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      await UsersTableTestHelper.addUser({ id: payload.userId });
      await ThreadsTableTestHelper.addThread({
        threadId: payload.threadId,
        userId: payload.userId,
      });
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        threadId: payload.threadId,
        userId: payload.userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.likeComment(payload.commentId, payload.userId);

      const commentLike = await CommentLikesTableTestHelper.findLikes(
        payload.commentId,
        payload.userId,
      );
      expect(commentLike).toHaveLength(1);
      expect(commentLike[0].commentId).toEqual(payload.commentId);
      expect(commentLike[0].userId).toEqual(payload.userId);
    });
  });

  describe('unlikeComment function', () => {
    it('should persist delete comment like', async () => {
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      await UsersTableTestHelper.addUser({ id: payload.userId });
      await ThreadsTableTestHelper.addThread({
        threadId: payload.threadId,
        userId: payload.userId,
      });
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        threadId: payload.threadId,
        userId: payload.userId,
      });
      await CommentLikesTableTestHelper.likeComment({
        commentId: payload.commentId,
        userId: payload.userId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.unlikeComment(payload.commentId, payload.userId);

      const commentLike = await CommentLikesTableTestHelper.findLikes(
        payload.commentId,
        payload.userId,
      );
      expect(commentLike).toHaveLength(0);
    });
  });
});

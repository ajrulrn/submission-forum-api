const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist create thread and return created thread correctly', async () => {
      const newThread = new NewThread({
        title: 'title',
        body: 'body',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(newThread);

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      const newThread = new NewThread({
        title: 'title',
        body: 'body',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when user not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      return expect(threadRepositoryPostgres.getThreadById('1'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread and when thread is found', async () => {
      const userPayload = {
        id: 'user-123',
        username: 'dicoding',
      };
      const threadPayload = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        userId: userPayload.id,
        date: new Date('2023-12-18T07:42:00'),
      };
      const expectedThread = new DetailThread({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        username: 'dicoding',
        date: new Date('2023-12-18T07:42:00'),
      });
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread(threadPayload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const detailThread = await threadRepositoryPostgres.getThreadById(threadPayload.id);

      expect(detailThread).toStrictEqual(expectedThread);
    });
  });

  describe('verifyThreadExists', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists('xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not return exception when thread was found', async () => {
      const userPayload = {
        id: 'user-1234',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.addThread({ id: threadId, userId: userPayload.id });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});

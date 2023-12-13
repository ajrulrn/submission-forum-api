const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'title',
      body: 'body',
    };

    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 123,
      owner: 'user-123',
    };

    expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedThread entities correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'title',
      owner: 'user-123',
    };

    const createdThread = new CreatedThread(payload);

    expect(createdThread).toBeInstanceOf(CreatedThread);
    expect(createdThread.id).toEqual(payload.id);
    expect(createdThread.title).toEqual(payload.title);
    expect(createdThread.owner).toEqual(payload.owner);
  });
});

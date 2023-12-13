const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
      content: 123,
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    const payload = {
      threadId: 'thread-123',
      userId: 'user-123',
      content: 'sebuah comment',
    };

    const newComment = new NewComment(payload);

    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.threadId).toEqual(payload.threadId);
    expect(newComment.userId).toEqual(payload.userId);
    expect(newComment.content).toEqual(payload.content);
  });
});

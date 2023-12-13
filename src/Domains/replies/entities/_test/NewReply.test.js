const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      content: 123,
    };

    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply entities correctly', () => {
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
      content: 'sebuah content',
    };

    const newReply = new NewReply(payload);

    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.commentId).toEqual(payload.commentId);
    expect(newReply.userId).toEqual(payload.userId);
    expect(newReply.content).toEqual(payload.content);
  });
});

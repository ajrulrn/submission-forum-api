const CreatedComment = require('../CreatedComments');

describe('a CreatedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah comment',
      owner: 'user-123',
    };

    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      content: 123,
      owner: 'user-123',
    };

    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedComment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah content',
      owner: 'user-123',
    };

    const createdComment = new CreatedComment(payload);

    expect(createdComment).toBeInstanceOf(CreatedComment);
    expect(createdComment.id).toEqual(payload.id);
    expect(createdComment.content).toEqual(payload.content);
    expect(createdComment.owner).toEqual(payload.owner);
  });
});

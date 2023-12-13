const CreatedReply = require('../CreatedReply');

describe('CreatedReply entities', () => {
  it('should throw error when payload did contain needed property', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah content',
    };

    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 123,
      owner: 'user-123',
    };

    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedReply entities correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah content',
      owner: 'user-123',
    };

    const createdReply = new CreatedReply(payload);

    expect(createdReply).toBeInstanceOf(CreatedReply);
    expect(createdReply.id).toEqual(payload.id);
    expect(createdReply.content).toEqual(payload.content);
    expect(createdReply.owner).toEqual(payload.owner);
  });
});

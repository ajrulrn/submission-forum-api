const DetailReply = require('../DetailReply');

describe('DetailReply', () => {
  it('should return error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      isDelete: false,
      content: 'sebuah konten',
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return error when payload not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah konten',
      date: 'date',
      isDelete: false,
      username: 'user-123',
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return DetailReply entities correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date(),
      isDelete: false,
      content: 'sebuah konten',
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.isDelete).toEqual(payload.isDelete);
    expect(detailReply.content).toEqual(payload.content);
  });

  it('should return DetailReply entities correctly with modified content', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date(),
      isDelete: true,
      content: 'sebuah konten',
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply).toBeInstanceOf(DetailReply);
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.isDelete).toEqual(payload.isDelete);
    expect(detailReply.content).toEqual('**balasan telah dihapus**');
  });
});

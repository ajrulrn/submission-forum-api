const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should return error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      isDelete: false,
      content: 'sebuah konten',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return error when payload not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: 'date',
      isDelete: false,
      content: 'sbuah konten',
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return DetailComment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      isDelete: false,
      date: new Date(),
      content: 'sebuah konten',
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.isDelete).toEqual(payload.isDelete);
    expect(detailComment.content).toEqual(payload.content);
  });

  it('should return DetailComment entities correctly with modified conten', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      isDelete: true,
      date: new Date(),
      content: 'sebuah konten',
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.isDelete).toEqual(payload.isDelete);
    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });
});

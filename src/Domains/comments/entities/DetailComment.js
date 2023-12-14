class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.isDelete = payload.isDelete;
    this.content = (payload.isDelete) ? '**komentar telah dihapus**' : payload.content;
  }

  _verifyPayload(payload) {
    const { id, username, date, isDelete, content } = payload;

    if (!id || !username || !date || isDelete === 'undefined' || !content) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || typeof isDelete !== 'boolean'
      || typeof content !== 'string'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;

class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = (payload.isDelete) ? '**balasan telah dihapus**' : payload.content;
    this.date = payload.date;
    this.isDelete = payload.isDelete;
    this.username = payload.username;
  }

  _verifyPayload(payload) {
    const { id, content, date, isDelete, username } = payload;

    if (!id || !content || !date || isDelete === 'undefined' || !username) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || !(date instanceof Date)
      || typeof isDelete !== 'boolean'
      || typeof username !== 'string'
    ) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;

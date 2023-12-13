class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.userId = payload.userId;
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const { commentId, userId, content } = payload;

    if (!commentId || !userId || !content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof userId !== 'string' || typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;

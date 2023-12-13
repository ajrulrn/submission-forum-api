class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.threadId = payload.threadId;
    this.userId = payload.userId;
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const { threadId, userId, content } = payload;

    if (!threadId|| !userId || !content) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof userId !== 'string' || typeof content !== 'string') {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewComment;

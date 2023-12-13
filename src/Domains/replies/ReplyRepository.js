class ReplyRepository {
  async getRepliesByThreadId(threadId){
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async addReply(reply) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(id) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyExists(id) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(id, userId) {
    throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;

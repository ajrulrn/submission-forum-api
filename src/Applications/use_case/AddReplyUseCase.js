const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExists(useCasePayload.threadId);
    const newReply = new NewReply(useCasePayload);
    await this._commentRepository.verifyCommentExists(newReply.commentId);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;

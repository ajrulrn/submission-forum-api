class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { threadId, commentId, userId } = payload;

    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    const isLikedComment = await this._commentRepository.isLikedComment(commentId);
    if (isLikedComment) {
      await this._commentRepository.unlikeComment(commentId, userId);
    } else {
      await this._commentRepository.likeComment(commentId, userId);
    }
  }
}

module.exports = LikeCommentUseCase;

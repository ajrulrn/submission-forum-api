class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);

    const mappedComments = await Promise.all(comments.map(async (comment) => {
      const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
      const likeCount = await this._commentRepository.countLikesByCommentId(comment.id);
      return { ...comment, replies, likeCount };
    }));

    thread.comments = mappedComments;

    return thread;
  }
}

module.exports = GetDetailThreadUseCase;

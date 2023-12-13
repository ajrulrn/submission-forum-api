class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload);
    const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload);

    const mappedComments = comments.map((comment) => {
      if (comment.isDelete) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.isDelete;
      return comment;
    });

    const mappedReplies = replies.map((reply) => {
      if (reply.isDelete) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.isDelete;
      return reply;
    });

    for (const comment of mappedComments) {
      comment.replies = [];
      for (const reply of mappedReplies) {
        if (comment.id === reply.commentId) {
          comment.replies.push(reply);
        }
        delete reply.commentId;
      }
    }

    thread.comments = mappedComments;

    return thread;
  }
}

module.exports = GetDetailThreadUseCase;

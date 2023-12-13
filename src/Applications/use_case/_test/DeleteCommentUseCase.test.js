const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.not.toThrow();
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});

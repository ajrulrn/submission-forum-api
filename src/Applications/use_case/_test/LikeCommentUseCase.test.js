const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.isLikedComment = jest.fn(() => Promise.resolve(false));
    mockCommentRepository.likeComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(likeCommentUseCase.execute(useCasePayload)).resolves.not.toThrow();
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.isLikedComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.likeComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.unlikeComment).not.toBeCalled();
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.isLikedComment = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.likeComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.unlikeComment = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(likeCommentUseCase.execute(useCasePayload)).resolves.not.toThrow();
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.isLikedComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    expect(mockCommentRepository.likeComment).not.toBeCalledWith();
    expect(mockCommentRepository.unlikeComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
  });
});

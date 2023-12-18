const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComments');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'sebuah comment',
      userId: 'user-123',
    };

    const mockCreatedComment = new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCreatedComment));
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const createdComment = await getCommentUseCase.execute(useCasePayload);

    expect(createdComment).toStrictEqual(new CreatedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    }));
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(useCasePayload));
  });
});

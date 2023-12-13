const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating detail thread correctly', async () => {
    const useCasePayload = 'thread-123';
    const expectedThread = {
      id: useCasePayload,
      title: 'title',
      body: 'body',
      username: 'user-123',
      date: '2023-12-13T05:01:38.434Z',
    };

    const expectedComments = [
      {
        id: 'comment-1',
        username: 'user-123',
        date: '2023-12-13T05:02:38.434Z',
        content: 'komen pertama',
        isDelete: 0,
      },
      {
        id: 'comment-2',
        username: 'user-123',
        date: '2023-12-13T05:03:38.434Z',
        content: 'komen kedua',
        isDelete: 0,
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-1',
        username: 'user-123',
        commentId: 'comment-1',
        content: 'balasan pertama',
        date: '2023-12-13T05:04:38.434Z',
        isDelete: 0,
      },
      {
        id: 'reply-2',
        username: 'user-123',
        commentId: 'comment-1',
        content: 'balasan kedua',
        date: '2023-12-13T05:05:38.434Z',
        isDelete: 0,
      },
    ];

    const expectedDetailThread = {
      id: useCasePayload,
      title: expectedThread.title,
      body: expectedThread.body,
      username: expectedThread.username,
      date: expectedThread.date,
      comments: [
        {
          id: 'comment-1',
          username: 'user-123',
          date: '2023-12-13T05:02:38.434Z',
          content: 'komen pertama',
          replies: expectedReplies,
        },
        {
          id: 'comment-2',
          username: 'user-123',
          date: '2023-12-13T05:03:38.434Z',
          content: 'komen kedua',
          replies: [],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload);
  });
});

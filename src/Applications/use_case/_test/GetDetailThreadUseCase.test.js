const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating detail thread correctly', async () => {
    const useCasePayload = 'thread-123';
    const mockThread = new DetailThread({
      id: useCasePayload,
      title: 'title',
      body: 'body',
      username: 'dicoding',
      date: new Date('2023-12-16T09:30:00'),
    });

    const mockComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: new Date('2023-12-16T09:30:00'),
        content: 'komen pertama',
        isDelete: false,
      }),
    ];

    const mockReplies = [
      new DetailReply({
        id: 'reply-1',
        username: 'dicoding',
        content: 'balasan pertama',
        date: new Date('2023-12-16T09:30:00'),
        isDelete: false,
      }),
      new DetailReply({
        id: 'reply-2',
        username: 'dicoding',
        content: 'balasan kedua',
        date: new Date('2023-12-16T09:30:00'),
        isDelete: false,
      }),
    ];

    const expectedDetailThread = new DetailThread({
      id: useCasePayload,
      title: 'title',
      body: 'body',
      username: 'dicoding',
      date: new Date('2023-12-16T09:30:00'),
    });

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: new Date('2023-12-16T09:30:00'),
        content: 'komen pertama',
        isDelete: false,
      },
    ];

    const expectedReplies = [
      new DetailReply({
        id: 'reply-1',
        username: 'dicoding',
        content: 'balasan pertama',
        date: new Date('2023-12-16T09:30:00'),
        isDelete: false,
      }),
      new DetailReply({
        id: 'reply-2',
        username: 'dicoding',
        content: 'balasan kedua',
        date: new Date('2023-12-16T09:30:00'),
        isDelete: false,
      }),
    ];

    expectedDetailThread.comments = expectedComments;
    expectedDetailThread.comments[0].replies = expectedReplies;

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    expect(detailThread).toStrictEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
  });
});

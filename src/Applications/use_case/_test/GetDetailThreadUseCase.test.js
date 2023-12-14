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
      date: new Date(),
    });

    const mockComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: new Date(),
        content: 'komen pertama',
        isDelete: false,
      }),
    ];

    const mockReplies = [
      new DetailReply({
        id: 'reply-1',
        username: 'dicoding',
        content: 'balasan pertama',
        date: new Date(),
        isDelete: false,
      }),
      new DetailReply({
        id: 'reply-2',
        username: 'dicoding',
        content: 'balasan kedua',
        date: new Date(),
        isDelete: false,
      }),
    ];

    const expectedDetailThread = {
      id: useCasePayload,
      title: 'title',
      body: 'body',
      username: 'dicoding',
      date: new Date(),
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: new Date(),
          content: 'komen pertama',
          replies: [
            {
              id: 'reply-1',
              username: 'dicoding',
              content: 'balasan pertama',
              date: new Date(),
            },
            {
              id: 'reply-2',
              username: 'dicoding',
              content: 'balasan kedua',
              date: new Date(),
            },
          ],
        },
      ],
    };

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

    const { comments } = detailThread;
    const { replies } = comments[0];

    expect(detailThread.id).toEqual(expectedDetailThread.id);
    expect(detailThread.title).toEqual(expectedDetailThread.title);
    expect(detailThread.body).toEqual(expectedDetailThread.body);
    expect(detailThread.username).toEqual(expectedDetailThread.username);
    expect(detailThread.date.getDate()).toEqual(expectedDetailThread.date.getDate());
    expect(comments[0].id).toEqual(expectedDetailThread.comments[0].id);
    expect(comments[0].username).toEqual(expectedDetailThread.comments[0].username);
    expect(comments[0].date.getDate()).toEqual(expectedDetailThread.comments[0].date.getDate());
    expect(comments[0].content).toEqual(expectedDetailThread.comments[0].content);
    expect(comments[0].isDelete).toEqual(false);
    expect(replies[0].id).toEqual(expectedDetailThread.comments[0].replies[0].id);
    expect(replies[0].username).toEqual(expectedDetailThread.comments[0].replies[0].username);
    expect(replies[0].date.getDate())
      .toEqual(expectedDetailThread.comments[0].replies[0].date.getDate());
    expect(replies[0].content).toEqual(expectedDetailThread.comments[0].replies[0].content);
    expect(replies[0].isDelete).toEqual(false);
    expect(replies[1].id).toEqual(expectedDetailThread.comments[0].replies[1].id);
    expect(replies[1].username).toEqual(expectedDetailThread.comments[0].replies[1].username);
    expect(replies[1].date.getDate())
      .toEqual(expectedDetailThread.comments[0].replies[1].date.getDate());
    expect(replies[1].content).toEqual(expectedDetailThread.comments[0].replies[1].content);
    expect(replies[1].isDelete).toEqual(false);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
  });
});

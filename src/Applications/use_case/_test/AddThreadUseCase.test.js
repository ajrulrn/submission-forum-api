const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'title',
      body: 'body',
      userId: 'user-123',
    };

    const mockCreatedThread = new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.userId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockCreatedThread));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const createdThread = await getThreadUseCase.execute(useCasePayload);

    expect(createdThread).toStrictEqual(new CreatedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.userId,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload));
  });
});

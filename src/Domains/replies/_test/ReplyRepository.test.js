const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.getRepliesByThreadId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.addReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.verifyReplyExists('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.verifyReplyOwner('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;
    Object.assign(request.payload, { userId, threadId, commentId });
    const addedReply = await addReplyUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { threadId, commentId, replyId } = request.params;
    const userId = request.auth.credentials.id;
    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      userId,
    });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = RepliesHandler;

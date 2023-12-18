const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    Object.assign(request.payload, {
      userId: request.auth.credentials.id,
      threadId: request.params.threadId,
    });
    const addedComment = await addCommentUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const userId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;
    await deleteCommentUseCase.execute({ threadId, commentId, userId });

    const response = h.response({
      status: 'success',
    });
    return response;
  }

  async putLikeCommentHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    await likeCommentUseCase.execute({ threadId, commentId, userId });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;

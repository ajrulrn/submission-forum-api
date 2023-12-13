const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async getThreadHandler(request, h) {
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const thread = await getDetailThreadUseCase.execute(request.params.threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    request.payload.userId = request.auth.credentials.id;
    const addedThread = await addThreadUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;

import {IpcMainEvent} from 'electron'
import {IpcRequest, RequestChannel} from './ipc'


/**
 * A class which encapsulates communication between ipcMain and ipcRenderer for a
 * single request.
 * */
abstract class IpcHandler<TRequest, TResponse> {
    abstract channel: RequestChannel
    sendResponse(event: IpcMainEvent, request: IpcRequest<TRequest>, response: TResponse): void {
        if (typeof request.responseChannel === 'string') {
            event.sender.send(request.responseChannel, response)
        }
    }

    abstract makeResponse(request: IpcRequest<TRequest>): Promise<TResponse>
    handle(event: IpcMainEvent, request: IpcRequest<TRequest>): void {
        this.makeResponse(request)
            .then(resp => this.sendResponse(event, request, resp))
            .catch(reason => console.log(reason))
    }
}

/**
 * A function which handles a single request of type TRequest and returns a TResponse.
 *
 * */
export type ResponseMaker = <TRequest, TResponse>(request: IpcRequest<TRequest>) => Promise<TResponse>

export const createHandler = <TRequest, TResponse>(responseMaker: ResponseMaker): IpcHandler<TRequest, TResponse> => {
    return new (class extends IpcHandler<TRequest, TResponse> {
        channel = ''

        makeResponse(request: IpcRequest<TRequest>): Promise<TResponse> {
            return responseMaker(request)
        }
    })()
}

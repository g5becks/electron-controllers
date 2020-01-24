import {IpcMainEvent} from 'electron'
import {IpcRequest, RequestChannel} from './ipc'


/**
 * A class which encapsulates communication between ipcMain and ipcRenderer for a
 * single channel.
 * */
export abstract class IpcHandler<TRequest, TResponse> {
    abstract channel: RequestChannel
    sendResponse(event: IpcMainEvent, request: IpcRequest<TRequest | TRequest[]>, response: TResponse | TResponse[]): void {
        if (typeof request.responseChannel === 'string') {
            event.sender.send(request.responseChannel, response)
        }
    }

    abstract makeResponse(request: IpcRequest<TRequest | TRequest[]>): Promise<TResponse | TResponse[]>
    handle(event: IpcMainEvent, request: IpcRequest<TRequest>): void {
        this.makeResponse(request)
            .then(resp => this.sendResponse(event, request, resp))
            .catch(reason => console.log(reason))
    }
}


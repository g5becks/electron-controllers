import {IpcHandler} from './handler'
import {CrudChannel} from './crud-channel'
import {IpcRequest} from './ipc'
/**
 * A function which handles a single request of type TRequest and returns a TResponse.
 *
 * */
export type Action = <TRequest, TResponse>(request: TRequest | TRequest[]) => Promise<TResponse | TResponse[]>

/**
 * This function is used to simplify the creation of IpcHandler classes.
 * @param requestHandler fulfills all requirements for implementing abstract class IpcHandler.
 * */
const createHandler = <TRequest, TResponse>(requestHandler: Action): IpcHandler<TRequest, TResponse> => {
    return new (class extends IpcHandler<TRequest, TResponse> {
        channel = ''

        makeResponse(request: IpcRequest<TRequest | TRequest[]>): Promise<TResponse | TResponse[]> {
            return requestHandler(request.payload)
        }
    })()
}

/**
 * A Controller for Crud Ipc operations.
 * @member add represents a create operation.
 * @member list represents a read operation and can use a custom request type in order to support querying.
 * @member
 * */
export abstract class IpcController {
    abstract crudChannel: CrudChannel
    abstract add<TRequest, TResponse>(entities: TRequest | TRequest[]): Promise<TResponse>
    abstract list<TRequest ,TResponse>(filter: TRequest): Promise<TResponse[]>
    abstract findById<TRequest, TResponse>(id: TRequest): Promise<TResponse>
    abstract remove<TRequest, TResponse>(entities: TRequest | TRequest[]): Promise<TResponse>
    abstract update<TRequest, TResponse>(entities: TRequest | TRequest[]): Promise<TResponse>
    private addHandler = createHandler(this.add)
    private listHandler = createHandler(this.list)
    private findByIdHandler = createHandler(this.findById)
    private removeHandler = createHandler(this.remove)
    private updateHandler = createHandler(this.update)
    private adjustHandlerChannels(): void {
        this.addHandler.channel = this.crudChannel.add
        this.listHandler.channel = this.crudChannel.list
        this.findByIdHandler.channel = this.crudChannel.findById
        this.removeHandler.channel = this.crudChannel.remove
        this.updateHandler.channel = this.crudChannel.update
    }
    public getHandlers(): IpcHandler<any, any>[] {
        this.adjustHandlerChannels()
        return [this.add, this.updateHandler, this.list, this.findById, this.removeHandler]
    }
}

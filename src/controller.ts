import { IpcHandler } from './handler'
import { CrudChannel } from './crud-channel'
import { IpcRequest, RequestChannel } from './ipc'
/**
 * @remarks
 * A function which handles a single request.
 *
 * */
export type Action<TRequest, TResponse> = (request: TRequest) => Promise<TResponse>

/**
 * This function aims to simplify the creation of IpcHandler classes.
 * @param requestHandler fulfills all requirements for implementing abstract class IpcHandler.
 * @param channel allows optional setting of the channel this handler will listen on.
 * */
export const createHandler = <TRequest, TResponse>(
  requestHandler: Action<TRequest, TResponse>,
  channel?: RequestChannel,
): IpcHandler<TRequest, TResponse> => {
  return new (class extends IpcHandler<TRequest, TResponse> {
    channel = channel ?? ''

    makeResponse(request: IpcRequest<TRequest>): Promise<TResponse> {
      return requestHandler(request.payload)
    }
  })()
}

/**
 * A Controller for Crud Ipc operations.
 * @member crudChannel holds an instance of CrudChannel and is used to automatically apply channels to each method on @this IpcController instance.
 * @member add represents a create operation.
 * @member list represents a read operation and can use a custom request type in order to support querying.
 * @member findById represents a read operation.
 * @member remove represents a delete operation.
 * @member update represents an update operation.
 * */
export abstract class IpcController {
  abstract crudChannel: CrudChannel
  abstract add(entities: any): Promise<any>
  abstract list(filter: any): Promise<any>
  abstract findById(id: any): Promise<any>
  abstract remove(entities: any): Promise<any>
  abstract update(entities: any): Promise<any>
  private addHandler = createHandler(this.add.bind(this))
  private listHandler = createHandler(this.list.bind(this))
  private findByIdHandler = createHandler(this.findById.bind(this))
  private removeHandler = createHandler(this.remove.bind(this))
  private updateHandler = createHandler(this.update.bind(this))
  private adjustHandlerChannels(): void {
    this.addHandler.channel = this.crudChannel.add
    this.listHandler.channel = this.crudChannel.list
    this.findByIdHandler.channel = this.crudChannel.findById
    this.removeHandler.channel = this.crudChannel.remove
    this.updateHandler.channel = this.crudChannel.update
  }
  public getHandlers(): Set<IpcHandler<any, any>> {
    this.adjustHandlerChannels()
    return new Set([this.addHandler, this.updateHandler, this.listHandler, this.findByIdHandler, this.removeHandler])
  }
}

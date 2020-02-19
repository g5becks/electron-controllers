import { IpcHandler } from './handler'
import { crudChannel, CrudChannel } from './crud-channel'
import { IpcRequest, RequestChannel } from './ipc'
import { CrudHandler } from './crud-handler'

/**
 * @remarks
 * A function which handles a single request.
 *
 * */
export type IpcAction<TRequest, TResponse> = (request: TRequest) => Promise<TResponse>

/**
 * This function aims to simplify the creation of IpcHandler classes.
 * @param action fulfills all requirements for implementing abstract class IpcHandler.
 * @param channel allows optional setting of the channel this handler will listen on.
 * */
export const createHandler = <TRequest, TResponse>(
  channel: RequestChannel = '',
  action: IpcAction<TRequest, TResponse>,
): IpcHandler<TRequest, TResponse> => {
  return new (class extends IpcHandler<TRequest, TResponse> {
    channel = channel

    makeResponse(request: IpcRequest<TRequest>): Promise<TResponse> {
      return action(request.payload)
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
  private addHandler(): IpcHandler<any, any> {
    return createHandler(this.crudChannel.add(), this.add.bind(this))
  }
  private listHandler(): IpcHandler<any, any> {
    return createHandler(this.crudChannel.list(), this.list.bind(this))
  }
  private findByIdHandler(): IpcHandler<any, any> {
    return createHandler(this.crudChannel.findById(), this.findById.bind(this))
  }
  private removeHandler(): IpcHandler<any, any> {
    return createHandler(this.crudChannel.remove(), this.remove.bind(this))
  }
  private updateHandler(): IpcHandler<any, any> {
    return createHandler(this.crudChannel.update(), this.update.bind(this))
  }
  public getHandlers(): Set<IpcHandler<any, any>> {
    return new Set([
      this.addHandler(),
      this.updateHandler(),
      this.listHandler(),
      this.findByIdHandler(),
      this.removeHandler(),
    ])
  }
}

export const createController = (crudHandler: Partial<CrudHandler>, basePath?: string): IpcController => {
  return new (class extends IpcController {
    crudChannel: CrudChannel = basePath ? crudChannel(basePath) : crudChannel()
    notImplemented = 'no request handler method implemented for request path'

    async add(entities: any): Promise<any> {
      return crudHandler && crudHandler.addHandler ? crudHandler.addHandler(entities) : this.notImplemented
    }

    async findById(id: any): Promise<any> {
      return crudHandler && crudHandler.findByIdHandler ? crudHandler.findByIdHandler(id) : this.notImplemented
    }

    async list(filter: any): Promise<any> {
      return crudHandler && crudHandler.listHandler ? crudHandler.listHandler(filter) : this.notImplemented
    }

    async remove(entities: any): Promise<any> {
      return crudHandler && crudHandler.removeHandler ? crudHandler.removeHandler(entities) : this.notImplemented
    }

    async update(entities: any): Promise<any> {
      return crudHandler && crudHandler.updateHandler ? crudHandler.updateHandler(entities) : this.notImplemented
    }
  })()
}

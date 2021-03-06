import { CrudChannel, IpcController, IpcHandler, IpcRequest } from '../src'
import { crudChannel } from '../src/crud-channel'

export class TestController extends IpcController {
  crudChannel: CrudChannel = crudChannel()

  public db: { [key: number]: string } = { 1: 'gary', 2: 'corey', 3: 'tonya', 4: 'brian', 5: 'adam' }
  // eslint-disable-next-line @typescript-eslint/require-await
  async add(entity: { name: string }): Promise<number> {
    this.db[Object.keys(this.db).length + 1] = entity.name
    return Object.keys(this.db).length
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: number): Promise<string> {
    return this.db[id]
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async list(filter: { limit: number }): Promise<string[]> {
    return Object.values(this.db).slice(0, filter.limit)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async remove(id: number): Promise<number> {
    delete this.db[id]
    return Object.keys(this.db).length
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async update(entity: { id: number; name: string }): Promise<string> {
    this.db[entity.id] = entity.name
    return this.db[entity.id]
  }
}

let controller: TestController | null
let handlers: Set<IpcHandler<any, any>> | null

const getHandler = (channelFilter: string): IpcHandler<any, any> | null => {
  let handlersArray: IpcHandler<any, any>[]
  let handler: IpcHandler<any, any>
  if (handlers) {
    handlersArray = Array.from(handlers.values())
    handler = handlersArray.filter(ipc => ipc.channel.includes(channelFilter))[0]
    return handler
  }
  return null
}

beforeEach(() => {
  controller = new TestController()
  handlers = controller.getHandlers()
})

afterEach(() => {
  controller = null
  handlers = null
})

test('controller should have 5 handlers', () => {
  expect(handlers?.size).toBe(5)
})

test('handler channels should not be empty', () => {
  handlers?.forEach(handler => expect(handler.channel).not.toBeFalsy())
})

test('remove handler should delete entry', async () => {
  const handler = getHandler('remove')
  const request: IpcRequest<number> = { responseChannel: '', payload: 1 }
  const response = await handler?.makeResponse(request)
  expect(response).toBe(4)
})

test('controller crudChannel basepath should not be undefined', () => {
  const path = controller?.crudChannel?.basePath
  expect(path).not.toBe('undefined')
})
test('add handler should add entry', async () => {
  const handler = getHandler('add')
  const request: IpcRequest<{ name: string }> = { responseChannel: '', payload: { name: 'testing' } }
  const response = await handler?.makeResponse(request)
  expect(response).toBe(6)
})

test('findById handler should return correct entry', async () => {
  const handler = getHandler('findById')
  const request: IpcRequest<number> = { responseChannel: '', payload: 2 }
  const response = await handler?.makeResponse(request)
  console.log(handler?.channel)
  expect(response).toBe('corey')
})

test('update handler should return updated entry', async () => {
  const handler = getHandler('update')
  const request: IpcRequest<{ id: number; name: string }> = { responseChannel: '', payload: { id: 3, name: 'harvey' } }
  const response = await handler?.makeResponse(request)
  expect(response).toBe('harvey')
})

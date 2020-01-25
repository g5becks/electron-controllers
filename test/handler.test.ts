import { createHandler, CrudChannel, IpcController, IpcRequest } from '../src'
import { Action } from '../src'

// eslint-disable-next-line @typescript-eslint/require-await
const myAction: Action<string, string> = async arg => `my ${arg}`
test('handlers should return proper responsegh', async () => {
  const request: IpcRequest<string> = { responseChannel: '', payload: 'testing' }
  const testHandler = createHandler(myAction)
  const response = await testHandler.makeResponse(request)
  expect(response).toBe(`my ${request.payload}`)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-ignore
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestController extends IpcController {
  crudChannel: CrudChannel = CrudChannel.create()

  // eslint-disable-next-line @typescript-eslint/require-await
  async add(entities: string[]): Promise<string> {
    return `${entities.length + 1}`
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: number): Promise<number> {
    return id + 1
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async list(filter: { limit: number }): Promise<number[]> {
    return [filter.limit]
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async remove(entities: string): Promise<string> {
    return `removing ${entities}`
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async update(entities: string): Promise<string> {
    return entities.toUpperCase()
  }
}

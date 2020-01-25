import { createHandler, IpcRequest } from '../src'
import { Action } from '../src'

test('handlers should return proper response', async () => {
  // eslint-disable-next-line @typescript-eslint/require-await
  const myAction: Action<string, string> = async arg => `my ${arg}`
  const request: IpcRequest<string> = { responseChannel: '', payload: 'testing' }
  const testHandler = createHandler(myAction)
  const response = await testHandler.makeResponse(request)
  expect(response).toBe(`my ${request.payload}`)
})

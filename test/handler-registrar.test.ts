import { TestController } from './controller.test'
import { IpcHandler } from '../src'
import { mergeHandlers } from '../src/handler-registrar'

const controller = new TestController()

const handlers: Set<IpcHandler<any, any>> = mergeHandlers(new Set([controller]))

test('mergeHandlers should return correct number of handlers', () => {
  expect(handlers.size).toBe(5)
})

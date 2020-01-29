import rewire from 'rewire'
import { TestController } from './controller.test'
import { IpcHandler } from '../src'

const handleRegistrar = rewire('../dist/src/handler-registrar.js')
const mergeHandlers = handleRegistrar.__get__('mergeHandlers')
const controller = new TestController()

const handlers: Set<IpcHandler<any, any>> = mergeHandlers(new Set([controller]))

test('mergeHandlers should return correct number of handlers', () => {
  expect(handlers.size).toBe(5)
})

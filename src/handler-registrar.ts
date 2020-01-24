import { IpcController } from './controller'
import { IpcHandler } from './handler'
import { ipcMain } from 'electron'

const getHandlersFromControllers = (controllers: Set<IpcController>): Set<IpcHandler<any, any>> => {
  const handlers = new Set<IpcHandler<any, any>>()
  controllers.forEach(ctrl => ctrl.getHandlers().forEach(handler => handlers.add(handler)))
  return handlers
}

const mergeHandlers = (
  controllers?: Set<IpcController>,
  handlers?: Set<IpcHandler<any, any>>,
): Set<IpcHandler<any, any>> => {
  const allHandlers = new Set<IpcHandler<any, any>>()
  if (controllers) {
    getHandlersFromControllers(controllers).forEach(handler => allHandlers.add(handler))
  }
  if (handlers) {
    handlers.forEach(handler => allHandlers.add(handler))
  }
  return allHandlers
}

/**
 * Used to register all event handlers in the main file of your electron application.
 * @param controllers is an array of all IpcControllers in your application.
 * @param handlers is an array of all IpcHandlers in your application.
 * */
export const registerHandlers = (controllers?: IpcController[], handlers?: IpcHandler<any, any>[]): void => {
  mergeHandlers(new Set(controllers), new Set(handlers)).forEach(handler =>
    ipcMain.on(handler.channel, (event, req) => handler.handle(event, req)),
  )
}

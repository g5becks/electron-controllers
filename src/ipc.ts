/**
 * @remarks
 * interface used to create unique nominal type aliases.
 * @see https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
 * */
interface Flavoring<FlavorT> {
    _type?: FlavorT
}
type Flavor<T, FlavorT> = T & Flavoring<FlavorT>

/**
 * @remarks
 * Represents a channel for ipcRenderer to send requests on.
 *
 * */
export type RequestChannel = Flavor<string, 'IPC_REQUEST_CHANNEL'>

/**
 * @remarks
 * Represents a channel for ipcMain to send responses on.
 *
 * */
export type ResponseChannel = Flavor<string, 'IPC_RESPONSE_CHANNEL'>

/**
 * @remarks
 * Represents a request sent from ipcRenderer
 * @prop responseChannel is used by the event handler in the main process to send a response to this request sender.
 * @prop payload contains the payload - if any, of this request.
 * */
export interface IpcRequest<T> {
    responseChannel?: ResponseChannel
    payload?: T
}

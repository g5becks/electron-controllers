// Flavor interface is a type used to create unique nominal type aliases.
// See https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
interface Flavoring<FlavorT> {
    _type?: FlavorT
}
type Flavor<T, FlavorT> = T & Flavoring<FlavorT>

/**
 * Represents a channel for ipcRenderer to send requests.
 *
 * */
export type RequestChannel = Flavor<string, 'IPC_REQUEST_CHANNEL'>

/**
 * Represents a channel for ipcMain to send responses.
 *
 * */
export type ResponseChannel = Flavor<string, 'IPC_RESPONSE_CHANNEL'>

/**
 * Represents a request send from ipcRenderer
 * @prop responseChannel is used to send a response to the request sender.
 * @prop payload contains the payload - if any, of the request.
 * */
export interface IpcRequest<T> {
    responseChannel?: ResponseChannel
    payload?: T
}

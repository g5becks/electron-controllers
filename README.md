
# electron-controllers

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue)](https://www.npmjs.com/package/electron-controllersl)
![build status](https://github.com/g5becks/electron-controllers/workflows/Node.js%20CI/badge.svg)
[![Dependency Status](https://david-dm.org/g5becks/electron-controllers.svg)](https://david-dm.org/g5becks/electron-controllers)

Simplified ipc architecture for electron applications using typescript.

## ⤴️ Motivation

- **Simplify.** Remove the need for managing channels manually, naming things is hard - so this package tries to do as much of that work for you as possible.<br>

- **Familiarity.** MVC is a well known pattern among developers which can help provide better structure to your application as it grows. This package provide the C - *controllers* part of the MVC pattern to your electron application.

## 💿 Installation

```bash
$ npm install --save electron-controllers
# or
$ yarn add electron-controllers
```

## 📖 Usage

electron-controllers was designed with typescript users in mind and exposes a very minimal api ( 7 types and two functions ).

## RequestChannel and ResponseChannel

RequestChannel and ResponseChannel are simple type aliases created using the [flavoring technique](https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/) for creating flexible nominal types.

```
// Represents a channel for ipcRenderer to send requests on.
type RequestChannel = Flavor<string, 'IPC_REQUEST_CHANNEL'>

// Represents a channel for ipcMain to send responses on.
type ResponseChannel = Flavor<string, 'IPC_RESPONSE_CHANNEL'>
```

## IpcRequest

IpcRequest represents a single request sent from [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) to [ipcMain](https://www.electronjs.org/docs/api/ipc-main). The full type signature is
```
interface IpcRequest<T = unknown> {
  responseChannel?: ResponseChannel // a nominal type alias for a string.
  payload: T
}
```

Where responseChannel is the channel that ipcMain will use to send a response to this request and payload is any data sent along with the request.

**Example Usage**

```
const request: IpcRequest<{ name: string }> = { responseChannel:  
 'testChannel', payload: { name: 'testing' } }
```

## IpcHandler

IpcHandler is an abstract class that contains all the logic needed for handling communication between [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) and [ipcMain](https://www.electronjs.org/docs/api/ipc-main) for a single [RequestChannel](#requestchannel-and-responsechannel) so you don't have to do it manually. The relevant bits of it's type signature are listed below.

```
abstract class IpcHandler<TRequest, TResponse> {
  abstract channel: RequestChannel
  
  abstract makeResponse(request: IpcRequest<TRequest>): Promise<TResponse>
}
```

To use the class simply extend from it and provide a channel to listen for requests on and a method which will take requests with a payload of type `TRequest` and use it to return a response of type `Promise<TResponse>`.

**Example Usage**

```
import { IpcHandler, RequestChannel } from 'electron-controllers'

class MyHandler extends IpcHandler<number, { id: number; name: string }> {
  channel: RequestChannel = 'myChannel'

  async makeResponse(request: IpcRequest<number>): Promise<{ id: number; name: string }> {
    return  getDataFromSomeWhereFunc(request.payload)
  }
} 
```

## IpcAction

IpcAction is nothing more than a type alias for a function that takes a request of type TRequest and returns a Promise<TResponse>. It's main use case is simplifying the creation of [IpcHandlers](#ipchandler) by removing the need to extract the payload from [IpcRequests](#ipcrequest) using the createHandler function which will be discussed later.

```
type IpcAction<TRequest, TResponse> = (request: TRequest) => Promise<TResponse>
```

## CrudChannel

CrudChannel is a class which handles routing for an IpcController instance by creating a set of routes (channels) that map to controller methods, it can also be used inside ipcRenderer for sending requests. Each instance of a CrudChannel contains 5 different channels that can be accessed using methods on the crud channel instance. To create an instance of CrudChannel, either use the `static create(basePath?: RequestChannel): CrudChannel` method on the CrudChannel class or the exported crudChannel function which has the same signature. If provided, the optional basePath parameter will be used as the root part of the request channels created by the CrudChannel instance, which can be useful for logging amongst other things.

**Example usage.**
```
import { CrudChannel, crudChannel } from 'electron-controllers'
const channel: CrudChannel = crudChannel() // using the crudChannel function without a basePath

const channel2: CrudChannel = CrudChannel.create('myBasePath') // using the static create method with a basePath

console.log(channel.basePath) // prints randomly created basePath
console.log(channel2.basePath) // prints 'myBasePath'

const addChannel = channel.add() // channel used for creating new entities
const listChannel = channel.list() // channel used for listing entities
const updateChannel = channel.update() // channel used for updating entities
const removeChannel = channel.remove() // channel used for deleting entities
const findByIdChannel = channel.findById() // channel used for finding an entity by id.
```

## IpcController
The IpcController abstract class is used to create controllers which map routes (channels) on the `crudChannel` member to crud operation methods on IpcController implementation instances. There are 5 abstract methods on the IpcController abstract class, when implemented these methods are used to handle incoming requests on each respective channel. The relevant bits of the type signature are listed below. Each method on an IpcController instance fits the signature of [IpcAction](#ipcaction) type, which is used behind the scenes by the IpcController class to create IpcHandler instances out of each method using the createHandler function.

```
abstract class IpcController {
  abstract crudChannel: CrudChannel // a crudChannel instance used to map channels to methods.
  abstract add(entities: any): Promise<any> // handles request made to the crudChannel.add() route
  abstract list(filter: any): Promise<any> // handles request made to the crudChannel.list() route
  abstract findById(id: any): Promise<any> // handles request made to the crudChannel.findById() route
  abstract remove(entities: any): Promise<any> // handles request made to the crudChannel.remove route
  abstract update(entities: any): Promise<any> // handles request made to the crudChannel.update() route
}
```

**Example Usage**
```
import { IpcController, crudChannel } 'electron-controllers'

export class MyController extends IpcController {
  crudChannel: CrudChannel = crudChannel()

  public db: { [key: number]: string } = { 1: 'typescript', 2: 
    'javascript', 3: 'golang', 4: 'dart', 5: 'C#' }
  
  async add(entity: { name: string }): Promise<number> {
    this.db[Object.keys(this.db).length + 1] = entity.name
    return Object.keys(this.db).length
  }

  async findById(id: number): Promise<string> {
    return this.db[id]
  }

  async list(filter: { limit: number }): Promise<string[]> {
    return Object.values(this.db).slice(0, filter.limit)
  }

  async remove(id: number): Promise<number> {
    delete this.db[id]
    return Object.keys(this.db).length
  }

  async update(entity: { id: number; name: string }): Promise<string> {
    this.db[entity.id] = entity.name
    return this.db[entity.id]
  }
}
```




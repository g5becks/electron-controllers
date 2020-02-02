
# electron-controllers

[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue)](https://www.npmjs.com/package/electron-controllersl)
![build status](https://github.com/g5becks/electron-controllers/workflows/Node.js%20CI/badge.svg)
[![Dependency Status](https://david-dm.org/g5becks/electron-controllers.svg)](https://david-dm.org/g5becks/electron-controllers)

Simplified controller based ipc architecture for electron applications using typescript.

## ⤴️ Motivation

- **Simplify.** Remove the need for managing channels manually, naming things is hard - so this package tries to do as much of the work for you as possible.<br>

- **Familiarity.** MVC is a well known design pattern among developers which can help provide better structure to your application as it grows. This package provide the C - *controllers* part of the MVC pattern to your electron application.

## 💿 Installation

```bash
$ npm install --save electron-controllers
# or
$ yarn add electron-controllers
```

## 📖 Usage

electron-controllers was designed with typescript users in mind and exposes a very minimal api ( 7 types and two functions ).

## RequestChannel and ResponseChannel

RequestChannel and ResponseChannel are simple type aliases created using the [flavoring technique](https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/) for creating flexible nominal types. Using these aliases in your application instead of strings not only helps by adding extra type safety, but also as a form of documentation.

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
  responseChannel?: ResponseChannel
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

To use the class simply extend from it and provide a channel to listen for requests on and override the method `makeResponse` take requests with a payload of type `TRequest` and returns a response of type `Promise<TResponse>`.

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

IpcAction is nothing more than a type alias for a function that takes a request of type `TRequest` and returns a `Promise<TResponse>`. It's main use case is simplifying the creation of [IpcHandlers](#ipchandler) by removing the need to extract the payload from [IpcRequests](#ipcrequest) using the createHandler function which will be discussed later.

```
type IpcAction<TRequest, TResponse> = (request: TRequest) => Promise<TResponse>
```

## CrudChannel

The CrudChannel class handles routing for a [IpcController](#ipccontroller) instances by creating a set of routes (channels) that map to controller methods, it can also be used inside ipcRenderer for sending requests. Each instance of a CrudChannel contains 5 different channels that can be accessed using methods on the crud channel instance. To create an instance of CrudChannel, either use the `static create(basePath?: RequestChannel): CrudChannel` method on the CrudChannel class or the exported `crudChannel` function which has the same signature. If provided, the optional `basePath?: RequestChannel` parameter will be used as the root part of the request channels created by the CrudChannel instance, which can be useful for logging amongst other things, if not provided it will be created for using a short random string.

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
The IpcController abstract class is used to create controllers which map routes (channels) on the `crudChannel` member to methods on IpcController implementation instances. There are 5 abstract methods on the IpcController abstract class, when implemented these methods are used to handle incoming requests on the crudChannel instance's routes with matching name, E.G. `crudChannel.add()` route will be handled by the `controller.add()` method and so on. The relevant bits of the type signature are listed below. Each method on an IpcController instance fits the signature of [IpcAction](#ipcaction) type, which is used behind the scenes by the IpcController class to create [IpcHandler](#ipchandler) instances out of each method using the createHandler function.

```
abstract class IpcController {
  abstract crudChannel: CrudChannel // a crudChannel instance used to map channels to methods.
  abstract add(entities: any): Promise<any> // handles request made to the crudChannel.add() route
  abstract list(filter: any): Promise<any> // handles request made to the crudChannel.list() route
  abstract findById(id: any): Promise<any> // handles request made to the crudChannel.findById() route
  abstract remove(entities: any): Promise<any> // handles request made to the crudChannel.remove() route
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

## createHandler

In some cases, an entire controller is not needed and it would be overkill to use one to handle requests being made on a single channel. In these cases you could of course create an instance of an [IpcHandler](#ipchandler), but an argument could be made that it's still a tad bit tedious to have to create a class and extend from another class just to implement a single method in order to handle incoming requests on a single channel. It's these types of use cases that the createHandler function was created for. createHandler takes a [RequestChannel](#requestchannel-and-responsechannel) and an [IpcAction](#ipcaction) function as parameters and returns an instance of [IpcHandler](#ipchandler), the full type signature is listed below.

```
const createHandler = <TRequest, TResponse>(
  channel: RequestChannel = '',
  action: IpcAction<TRequest, TResponse>,
): IpcHandler<TRequest, TResponse>
```

**Example Usage**

```
import { createHandler, IpcAction, IpcRequest } from 'electron-controllers'

const myAction: IpcAction<number, { id: number, name: string}> =  
 async ( id: number) => { 
    const data = await getDataFromSomewhereUsingId(id)
    return data
}

const myHandler = createHandler(myAction)
const request: IpcRequest<number> = { responseChannel: 'someChannel', payload: 2389 }

// makeResponse is rarely, if ever invoked explicitly as shown below in real applications.

const response: { id: number, name: string} = await myHandler.makeResponse(request)
```

## registerHandlers

Once you have defined all of the [IpcHandlers](#ipchandler) and [IpcControllers](#ipccontroller) that your application will use, you need to let electron know how to use them in your application somehow, this is where the registerHandlers function comes into play. In the entry point of your electron application ( the main.js or main.ts file ) you call the registerHandlers function, passing in an optional list of all the [IpcControllers](#ipccontroller) that your application has defined and an optional list of all of the [IpcHandlers](#ipchandler), the registerHandlers function will take care of the rest. What is does under the hood is quite simple, it extracts all of the channels from your controllers and handlers, and then call [ipcMain.on](https://www.electronjs.org/docs/api/ipc-main#ipcmainonchannel-listener) for each channel, passing in a single method from [IpcHandler](#ipchandler) ( IpcHandler.handle() ) abstract class which takes care of sending a response to [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) on your behalf. The full type signature for the function is shown below.

```
const registerHandlers = (controllers?: IpcController[], handlers?: IpcHandler<any, any>[]): void
```

```
const controllers = [new MyController1(), new MyController2, new MyController3()]

const handlers = [createHandler('someChannel', async (id: number) => await getDataFromDb(id)), new MyHandler() ]

// somewhere inside main.ts
registerHandlers(controllers, handlers)

```

## Contributing

All contributions are welcome and greatly appreciated. :thumbsup:

## Bug Reports or Feature Requests

Please use GitHub Issues.

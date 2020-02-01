
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

## IpcRequest

IpcRequest represents a single request sent from [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) to [ipcMain](https://www.electronjs.org/docs/api/ipc-main). The full type signature is
`interface IpcRequest<T = unknown> {
  responseChannel?: ResponseChannel // a nominal type alias for a string.
  payload: T
}`

Where responseChannel is the channel that ipcMain will use to send a response to this request and payload is any data sent along with the request.

```

```

## IpcController
The IpcController abstract class can be extended in order to .
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
Please refer to the wiki for more information.

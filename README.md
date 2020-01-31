
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

```
export class TestController extends IpcController {
  crudChannel: CrudChannel = crudChannel()

  public db: { [key: number]: string } = { 1: 'gary', 2: 'corey', 3: 'tonya', 4: 'brian', 5: 'adam' }
  // eslint-disable-next-line @typescript-eslint/require-await
  async add(entity: { name: string }): Promise<number> {
    this.db[Object.keys(this.db).length + 1] = entity.name
    return Object.keys(this.db).length
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: number): Promise<string> {
    return this.db[id]
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async list(filter: { limit: number }): Promise<string[]> {
    return Object.values(this.db).slice(0, filter.limit)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async remove(id: number): Promise<number> {
    delete this.db[id]
    return Object.keys(this.db).length
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async update(entity: { id: number; name: string }): Promise<string> {
    this.db[entity.id] = entity.name
    return this.db[entity.id]
  }
}
```

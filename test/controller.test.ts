import { CrudChannel, IpcController } from '../src'

class TestController extends IpcController {
  crudChannel: CrudChannel = CrudChannel.create()

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

const controller = new TestController()
const handlers = controller.getHandlers()
test('controller should have 5 handlers', () => {
  expect(handlers.size).toBe(5)
})

test('handler channels should not be empty', () => {
  handlers.forEach(handler => expect(handler.channel).not.toBeFalsy())
})

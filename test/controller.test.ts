import { CrudChannel, IpcController } from '../src'

class TestController extends IpcController {
  crudChannel: CrudChannel = CrudChannel.create()

  public db = { 1: 'gary', 2: 'corey', 3: 'tonya', 4: 'brian', 5: 'adam' }
  // eslint-disable-next-line @typescript-eslint/require-await
  async add(entities: string[]): Promise<string> {
    return `${entities.length + 1}`
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: number): Promise<number> {
    return id + 1
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async list(filter: { limit: number }): Promise<number[]> {
    return [filter.limit]
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async remove(entities: string): Promise<string> {
    return `removing ${entities}`
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async update(entities: string): Promise<string> {
    return entities.toUpperCase()
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

import { CrudChannel } from '../src'
import { crudChannel } from '../src/crud-channel'

const channel: CrudChannel = crudChannel()

test('basePath should not be undefined', () => {
  const isUndefined = channel.basePath === 'undefined'
  console.log(channel.basePath)
  expect(isUndefined).toBeFalsy()
})

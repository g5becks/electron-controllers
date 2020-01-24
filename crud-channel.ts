import { RequestChannel } from './ipc'
import shortid from 'shortid'

/**
 * Encapsulates the creation of channels supporting common crud operations.
 * @member basePath is optional and will created on your behalf if not provided.
 * @member add contains the channel used for create operations.
 * @member list contains the channel used for query operations.
 * @member findById contains the channel used for querying by id field.
 * @member update contains the channel used for update operations.
 * @member remove contains the channel used for delete operations.
 * */
export class CrudChannel {
  constructor(public basePath?: RequestChannel) {
    if (!this.basePath) {
      const id = shortid()
      const time = new Date().getUTCMilliseconds()
      this.basePath = `index/${time}/${id}`
    }
  }
  public readonly add = `${this.basePath}/add`
  public readonly list = `${this.basePath}/list`
  public readonly findById = `${this.basePath}/findById`
  public readonly update = `${this.basePath}/update`
  public readonly remove = `${this.basePath}/remove`

  public static create(basePath?: RequestChannel): CrudChannel {
    return new CrudChannel(basePath)
  }
}

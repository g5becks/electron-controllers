import shortid from 'shortid'
import { RequestChannel } from './ipc'

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
  private constructor(public basePath?: RequestChannel) {
    if (!this.basePath) {
      this.basePath = `${shortid()}`
    }
  }
  public add = (): RequestChannel => `${this.basePath}/add`
  public list = (): RequestChannel => `${this.basePath}/list`
  public findById = (): RequestChannel => `${this.basePath}/findById`
  public readonly update = (): RequestChannel => `${this.basePath}/update`
  public readonly remove = (): RequestChannel => `${this.basePath}/remove`

  public static create(basePath?: RequestChannel): CrudChannel {
    return new CrudChannel(basePath)
  }
}

export const crudChannel = (basePath?: RequestChannel): CrudChannel => CrudChannel.create(basePath)

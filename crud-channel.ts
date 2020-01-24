import {RequestChannel} from './ipc'
import shortid from 'shortid'

/**
 * Encapsulates the creation of channels supporting common crud operations.
 *
 * */
export class CrudChannel {
    constructor(public index?: RequestChannel) {
        if (!this.index) {
            const id = shortid()
            const time = new Date().getUTCMilliseconds()
            this.index = `index/${time}/${id}`
        }
    }
    public readonly add = `${this.index}/add`
    public readonly list = `${this.index}/list`
    public readonly findById = `${this.index}/findById`
    public readonly update = `${this.index}/update`
    public readonly updateAll = `${this.index}/update-all`
    public readonly remove = `${this.index}/remove`
    public readonly removeAll = `${this.index}/remove-all`

    public static create(index?: RequestChannel): CrudChannel {
        return new CrudChannel(index)
    }
}

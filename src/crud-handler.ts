export interface CrudHandler {
  addHandler(entities: any): Promise<any>
  listHandler(filter: any): Promise<any>
  findByIdHandler(id: any): Promise<any>
  removeHandler(entities: any): Promise<any>
  updateHandler(entities: any): Promise<any>
}

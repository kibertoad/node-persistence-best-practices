import { AbstractRepository } from 'knex-repositories'
import { Dependencies } from '../infrastructure/diConfig'
import { NewUserRow, UpdateUserRow, UserRow } from './UserRepository'

export class UserRepository2 extends AbstractRepository<NewUserRow, UserRow, UpdateUserRow> {
  constructor({ knex }: Dependencies) {
    super(knex, {
      tableName: 'users',
      idColumn: 'userId',
      columnsToFetchList: [
        'userId',
        'username',
        'email',
        'isBlocked',
        'createdAt',
        'updatedAt',
      ],
    })
  }
}

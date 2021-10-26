import { Dependencies } from '../infrastructure/diConfig'
import { AbstractRepository } from 'knex-repositories'
import { BalanceRow, NewAccountRow } from './AccountRepository'

export class AccountRepository2 extends AbstractRepository<NewAccountRow, BalanceRow> {
  constructor({ knex }: Dependencies) {
    super(knex, {
      tableName: 'accounts',
      idColumn: 'accountId',
      columnsForUpdate: ['balanceAmount', 'isBlocked'],
    })
  }
}

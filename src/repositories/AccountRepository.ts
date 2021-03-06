import { Knex } from 'knex'
import { Dependencies } from '../infrastructure/diConfig'
import TransactionProvider = Knex.TransactionProvider

export type BalanceRow = {
  accountId: number
  userId: number
  balanceAmount: number
  balanceCurrency: string
  isBlocked: boolean
}

export type NewAccountRow = {
  userId: number
  balanceAmount: number
  balanceCurrency: string
  isBlocked: boolean
}

export class AccountRepository {
  private readonly knex: Knex

  constructor({ knex }: Dependencies) {
    this.knex = knex
  }

  async getBalanceForUpdate(
    userId: number,
    transactionProvider: TransactionProvider,
  ): Promise<BalanceRow> {
    const trx = await transactionProvider()
    const result = await this.knex('accounts').transacting(trx).forUpdate().select('*').where({
      userId,
    })
    return result[0]
  }

  async createAccount(newAccount: NewAccountRow): Promise<void> {
    await this.knex('accounts').insert(newAccount)
  }

  async getBalance(userId: number): Promise<BalanceRow> {
    const result = await this.knex<BalanceRow>('accounts').select('*').where({
      userId,
    })

    return result[0]
  }

  async updateBalance(
    userId: number,
    newBalance: number,
    transactionProvider: TransactionProvider,
  ): Promise<BalanceRow> {
    const trx = await transactionProvider()
    const result = await this.knex('accounts')
      .transacting(trx)
      .update({
        balanceAmount: newBalance,
      })
      .where({ userId })
      .returning('*')

    return result[0]
  }
}

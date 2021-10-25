import { Dependencies } from '../infrastructure/diConfig'
import { AccountRepository } from '../repositories/AccountRepository'
import { Knex } from 'knex'

export class AccountService {
  private readonly knex: Knex
  private readonly accountRepository: AccountRepository

  constructor({ accountRepository, knex }: Dependencies) {
    this.knex = knex
    this.accountRepository = accountRepository
  }

  async receiveFunds(toUserId: number, amount: number) {
    const transactionProvider = this.knex.transactionProvider()

    try {
      const balanceTo = await this.accountRepository.getBalanceForUpdate(
        toUserId,
        transactionProvider,
      )
      const newBalanceTo = balanceTo.balanceAmount + amount
      await this.accountRepository.updateBalance(toUserId, newBalanceTo, transactionProvider)
      const transaction = await transactionProvider()
      transaction.commit()
    } catch (err: any) {
      const transaction = await transactionProvider()
      transaction.rollback()
      throw err
    }
  }

  async transferFundsInternally(fromUserId: number, toUserId: number, amount: number) {
    const transactionProvider = this.knex.transactionProvider()

    try {
      const accountFrom = await this.accountRepository.getBalanceForUpdate(
        fromUserId,
        transactionProvider,
      )
      const newBalanceFrom = accountFrom.balanceAmount - amount
      await this.accountRepository.updateBalance(fromUserId, newBalanceFrom, transactionProvider)

      const balanceTo = await this.accountRepository.getBalanceForUpdate(
        toUserId,
        transactionProvider,
      )
      const newBalanceTo = balanceTo.balanceAmount + amount
      await this.accountRepository.updateBalance(toUserId, newBalanceTo, transactionProvider)
      const transaction = await transactionProvider()
      transaction.commit()
    } catch (err: any) {
      const transaction = await transactionProvider()
      transaction.rollback()
      throw err
    }
  }

  async createAccount(userId: number): Promise<void> {
    await this.accountRepository.createAccount(userId, {
      balanceAmount: 0,
      balanceCurrency: 'EUR',
      isBlocked: false,
    })
  }

  async getAccountBalance(userId: number): Promise<number> {
    const balance = await this.accountRepository.getBalance(userId)
    return balance.balanceAmount
  }
}

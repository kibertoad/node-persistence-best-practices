import { Dependencies } from '../infrastructure/diConfig'
import { Knex } from 'knex'
import { AccountRepository2 } from '../repositories/AccountRepository2'

export class AccountService2 {
  private readonly knex: Knex
  private readonly accountRepository: AccountRepository2

  constructor({ accountRepository2, knex }: Dependencies) {
    this.knex = knex
    this.accountRepository = accountRepository2
  }

  async receiveFunds(toUserId: number, amount: number) {
    const transactionProvider = this.knex.transactionProvider()

    try {
      const [accountTo] = await this.accountRepository.getByCriteriaForUpdate(transactionProvider, {
        userId: toUserId,
      })
      const newBalanceTo = accountTo.balanceAmount + amount
      await this.accountRepository.updateByCriteria(
        {
          userId: toUserId,
        },
        {
          balanceAmount: newBalanceTo,
        },
        transactionProvider,
      )
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
      const [accountFrom] = await this.accountRepository.getByCriteriaForUpdate(
        transactionProvider,
        {
          userId: fromUserId,
        },
      )
      const newBalanceFrom = accountFrom.balanceAmount - amount
      await this.accountRepository.updateByCriteria(
        {
          userId: fromUserId,
        },
        {
          balanceAmount: newBalanceFrom,
        },
        transactionProvider,
      )

      const [accountTo] = await this.accountRepository.getByCriteriaForUpdate(transactionProvider, {
        userId: toUserId,
      })
      const newBalanceTo = accountTo.balanceAmount + amount
      await this.accountRepository.updateByCriteria(
        {
          userId: toUserId,
        },
        {
          balanceAmount: newBalanceTo,
        },
        transactionProvider,
      )
      const transaction = await transactionProvider()
      transaction.commit()
    } catch (err: any) {
      const transaction = await transactionProvider()
      transaction.rollback()
      throw err
    }
  }

  async createAccount(userId: number): Promise<void> {
    await this.accountRepository.create({
      userId,
      balanceAmount: 0,
      balanceCurrency: 'EUR',
      isBlocked: false,
    })
  }

  async getAccountBalance(userId: number): Promise<number> {
    const account = await this.accountRepository.getSingleByCriteria({
      userId,
    })
    if (!account) {
      throw new Error('Account not found')
    }
    return account.balanceAmount
  }
}

import { AppContainer, createDIContainer } from '../infrastructure/diConfig'
import tableCleaner from 'knex-tablecleaner'
import { UserBuilder } from '../../test/builders/UserBuilder'

describe('AccountService', () => {
  let container: AppContainer
  beforeAll(() => {
    container = createDIContainer()
  })
  beforeEach(async () => {
    await tableCleaner.cleanTables(container.cradle.knex, ['accounts', 'users'])
  })
  afterAll(async () => {
    await container.dispose()
  })

  describe('transferFundsInternally', () => {
    it('correctly transfers funds', async () => {
      const { accountService } = container.cradle

      const user1 = await new UserBuilder(container.cradle).build()
      const user2 = await new UserBuilder(container.cradle)
        .username('user2')
        .email('test2@test.lt')
        .build()
      await accountService.createAccount(user1.userId)
      await accountService.createAccount(user2.userId)

      await accountService.transferFundsInternally(user1.userId, user2.userId, 999)
      const balance1 = await accountService.getAccountBalance(user1.userId)
      const balance2 = await accountService.getAccountBalance(user2.userId)

      expect(balance1).toEqual(-999)
      expect(balance2).toEqual(999)
    })

    it('correctly rollbacks transaction', async () => {
      expect.assertions(2)
      const { accountService } = container.cradle

      const user1 = await new UserBuilder(container.cradle).build()
      await accountService.createAccount(user1.userId)

      try {
        await accountService.transferFundsInternally(user1.userId, -1, 999)
      } catch (err: any) {
        expect(err.message).toEqual("Cannot read properties of undefined (reading 'balanceAmount')")
      }
      const balance1 = await accountService.getAccountBalance(user1.userId)

      expect(balance1).toEqual(0)
    })
  })
})

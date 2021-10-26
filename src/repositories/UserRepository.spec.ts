import { NewUserRow } from './UserRepository'
import { AppContainer, createDIContainer } from '../infrastructure/diConfig'
import tableCleaner from 'knex-tablecleaner'

describe('UserRepository', () => {
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

  const newUser: NewUserRow = {
    email: 'test@test.lt',
    username: 'Vardenis',
    isBlocked: false,
    passwordHash: 'dummy',
  }
  const userAssertion = {
    email: 'test@test.lt',
    isBlocked: false,
    userId: expect.any(Number),
    username: 'Vardenis',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  }

  describe('createUser', () => {
    it('successfully creates new user', async () => {
      const { userRepository } = container.cradle

      const result = await userRepository.createUser(newUser)

      expect(result).toMatchObject(userAssertion)
    })
  })

  describe('getUser', () => {
    it('successfully retrieves user', async () => {
      const { userRepository } = container.cradle
      const createdUser = await userRepository.createUser(newUser)

      const result = await userRepository.getUser(createdUser.userId)

      expect(result).toMatchObject({
        ...userAssertion,
        passwordHash: 'dummy',
      })
    })
  })

  describe('updateUser', () => {
    it('successfully updates user', async () => {
      const { userRepository } = container.cradle
      const createdUser = await userRepository.createUser(newUser)

      const result = await userRepository.updateUser(createdUser.userId, {
        email: 'other@test.lt',
        username: 'newId',
      })

      expect(result).toMatchObject({
        ...userAssertion,
        email: 'other@test.lt',
        username: 'newId',
      })
    })
  })
})

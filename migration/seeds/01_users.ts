import { Knex } from 'knex'
import { UserRepository } from '../../src/repositories/UserRepository'
import { Dependencies } from '../../src/infrastructure/diConfig'
import { UserBuilder } from '../../test/builders/UserBuilder'
import { UserService } from '../../src/services/UserService'
import tableCleaner from 'knex-tablecleaner'

exports.seed = async (knex: Knex) => {
  await tableCleaner.cleanTables(knex, ['accounts', 'users'])
  const userRepository = new UserRepository({ knex } as Dependencies)
  const userService = new UserService({ userRepository } as Dependencies)

  await new UserBuilder({ userService } as Dependencies).username('testUser').build()
}

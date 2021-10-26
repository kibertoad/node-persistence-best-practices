import { asClass, asFunction, AwilixContainer, createContainer, Lifetime } from 'awilix'
import { knex, Knex } from 'knex'
import { Config, getConfig } from './config'
import { UserService } from '../services/UserService'
import { UserRepository } from '../repositories/UserRepository'
import { AccountService } from '../services/AccountService'
import { AccountRepository } from '../repositories/AccountRepository'
import { UserRepository2 } from '../repositories/UserRepository2'
import { AccountRepository2 } from '../repositories/AccountRepository2'
import { AccountService2 } from '../services/AccountService2'

type DiConfig = Record<keyof Dependencies, any>

export interface Dependencies {
  knex: Knex
  config: Config

  userService: UserService
  userRepository: UserRepository
  userRepository2: UserRepository2

  accountService: AccountService
  accountService2: AccountService2
  accountRepository: AccountRepository
  accountRepository2: AccountRepository2
}

const SINGLETON_CONFIG = { lifetime: Lifetime.SINGLETON }

export function getDiConfig(): DiConfig {
  const diConfig: DiConfig = {
    config: asFunction(() => {
      return getConfig()
    }, SINGLETON_CONFIG),

    knex: asFunction(
      (dependencies: Dependencies) => {
        return knex({
          ...dependencies.config.dbConfig,
          migrations: {
            directory: 'migration/migrations',
          },
          seeds: {
            directory: 'migration/seeds',
          },
        })
      },
      {
        lifetime: Lifetime.SINGLETON,
        dispose: (module: Knex) => module.destroy(),
      },
    ),

    userRepository: asClass(UserRepository, SINGLETON_CONFIG),
    userRepository2: asClass(UserRepository2, SINGLETON_CONFIG),
    userService: asClass(UserService, SINGLETON_CONFIG),

    accountRepository: asClass(AccountRepository, SINGLETON_CONFIG),
    accountRepository2: asClass(AccountRepository2, SINGLETON_CONFIG),
    accountService: asClass(AccountService, SINGLETON_CONFIG),
    accountService2: asClass(AccountService2, SINGLETON_CONFIG),
  }

  return diConfig
}

export function createDIContainer(config?: DiConfig): AppContainer {
  config = config ?? getDiConfig()
  const diContainer = createContainer({
    injectionMode: 'PROXY',
  })
  diContainer.register(config)
  return diContainer
}

export type AppContainer = AwilixContainer<Dependencies>

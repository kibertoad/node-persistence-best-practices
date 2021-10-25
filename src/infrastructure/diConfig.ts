import { asClass, asFunction, AwilixContainer, createContainer, Lifetime } from 'awilix'
import { knex, Knex } from 'knex'
import { Config, getConfig } from './config'
import { UserService } from '../services/UserService'
import { UserRepository } from '../repositories/UserRepository'
import { AccountService } from '../services/AccountService'
import { AccountRepository } from '../repositories/AccountRepository'

type DiConfig = Record<keyof Dependencies, any>

export interface Dependencies {
  knex: Knex
  config: Config

  userService: UserService
  userRepository: UserRepository

  accountService: AccountService
  accountRepository: AccountRepository
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
    userService: asClass(UserService, SINGLETON_CONFIG),

    accountRepository: asClass(AccountRepository, SINGLETON_CONFIG),
    accountService: asClass(AccountService, SINGLETON_CONFIG),
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

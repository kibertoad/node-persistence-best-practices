import { config } from 'dotenv'
import { Knex } from 'knex'

config()

// Acessing env variables directly is expensive and is to be avoided
let env = { ...process.env }

// This is sometimes useful for tests
export function reloadConfig() {
  env = { ...process.env }
}

export type Config = {
  dbConfig: Knex.Config
}

export function getDbConfig(): Knex.Config {
  return {
    client: 'pg',
    connection: {
      user: getMandatory('EXAMPLE_APP_DB_USER'),
      password: getMandatory('EXAMPLE_APP_DB_PASSWORD'),
      database: getOptionalNullable('EXAMPLE_APP_DB_DATABASE', null) as string,
      host: getMandatory('EXAMPLE_APP_DB_SERVER'),
      port: getMandatoryInteger('EXAMPLE_APP_DB_PORT'),
      ssl: false,
    },
  }
}

export function getConfig(): Config {
  return {
    dbConfig: getDbConfig(),
  }
}

function getMandatory(param: string): string {
  if (!env[param]) {
    throw new Error(`Missing mandatory configuration parameter: ${param}`)
  }
  return env[param]!
}

function getMandatoryInteger(param: string): number {
  if (!env[param]) {
    throw new Error(`Missing mandatory configuration parameter: ${param}`)
  }
  return Number.parseInt(env[param]!)
}

function getOptionalNullable(param: string, defaultValue: string | null): string | null {
  return env[param] ?? defaultValue
}

export function isProduction(): boolean {
  return env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return env.NODE_ENV !== 'production'
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test'
}

import { createDIContainer, getDiConfig } from '../src/infrastructure/diConfig'

const diConfig = getDiConfig()
const container = createDIContainer(diConfig)

const { knex } = container.cradle

console.log('Start migrating DB')
knex.migrate.latest().then(function () {
  console.log('DB migration completed successfully.')
  return knex.destroy()
})

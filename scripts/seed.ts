import {createDIContainer, getDiConfig} from "../src/infrastructure/diConfig";

const diConfig = getDiConfig()
const container = createDIContainer(diConfig)

const { knex } = container.cradle
console.log('Start seeding DB')
knex.seed.run().then(function () {
  console.log('DB seeded successfully')
  return knex.destroy()
})

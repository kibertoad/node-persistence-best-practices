import { knex } from "knex";
import {getDbConfig, isProduction} from "../src/infrastructure/config";

if (isProduction()) {
  console.error('Cannot drop production')
  process.exit(0)
}

async function drop() {
  const dbConfig = getDbConfig()
  const knexInstance = knex({
    ...dbConfig,
    migrations: {
      directory: 'migration/migrations',
    },
  })

  await knexInstance.raw('DROP SCHEMA public CASCADE')
  await knexInstance.raw('CREATE SCHEMA public')
  await knexInstance.raw('GRANT ALL ON SCHEMA public TO public')
}

drop().then(() => {
  console.log('DB dropped successfully')
  process.exit(0)
})

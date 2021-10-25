import { Knex } from 'knex'

exports.up = async function (knex: Knex): Promise<void> {
  await knex.schema.createTable('departments', (table) => {
    table.increments('departmentId').primary()
    table.string('name', 256).notNullable().index()
    table.string('abbreviation', 64).notNullable().unique()
    table.string('email', 128).nullable()
    table.string('webpage', 128).nullable()
    table.string('additionalInfo', 1024).nullable()
    table.boolean('isActive').notNullable().index()
  })
}

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable('departments')
}

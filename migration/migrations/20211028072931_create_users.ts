import { Knex } from 'knex'

exports.up = async function (knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('userId').primary()
    table.string('email', 256).unique()
    table.string('username', 256).notNullable().unique()
    table.string('passwordHash', 256).notNullable()
    table.boolean('isBlocked').notNullable()

    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()
  })
}

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable('users')
}

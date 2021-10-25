import { Knex } from 'knex'

exports.up = async function (knex: Knex): Promise<void> {
  await knex.schema.createTable('accounts', (table) => {
    table.increments('accountId').primary()
    table.integer('userId').notNullable().unique()
    table.integer('balanceAmount').notNullable().index()
    table.string('balanceCurrency').notNullable().index()
    table.boolean('isBlocked').notNullable()

    table.dateTime('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updatedAt').defaultTo(knex.fn.now()).notNullable()

    table.foreign('userId').references('users.userId')
  })
}

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable('accounts')
}

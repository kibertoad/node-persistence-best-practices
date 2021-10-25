import { Dependencies } from '../infrastructure/diConfig'
import { Knex } from 'knex'
import { pickWithoutUndefined } from 'knex-utils'

export type NewUserRow = {
  username: string
  email: string
  passwordHash: string
  departmentId?: number
  isBlocked: boolean
}

export type UserRow = NewUserRow & {
  userId: number
  createdAt: Date
  updatedAt: Date
}

export type ListUserRow = Exclude<UserRow, ['passwordHash']>

export type UpdateUserRow = {
  username?: string
  email?: string
  departmentId?: number
  isBlocked?: boolean
}

const ALL_USER_COLUMNS: (keyof UserRow)[] = [
  'userId',
  'departmentId',
  'username',
  'email',
  'isBlocked',
  'passwordHash',
  'createdAt',
  'updatedAt',
]

const LIST_USER_COLUMNS: (keyof UserRow)[] = [
  'userId',
  'departmentId',
  'username',
  'email',
  'isBlocked',
  'createdAt',
  'updatedAt',
]

const UPDATEABLE_USER_COLUMNS: (keyof UpdateUserRow)[] = [
  'username',
  'email',
  'departmentId',
  'isBlocked',
]

export class UserRepository {
  private readonly knex: Knex

  constructor({ knex }: Dependencies) {
    this.knex = knex
  }

  async createUser(user: NewUserRow): Promise<ListUserRow> {
    const result = await this.knex<ListUserRow>('users').insert(user).returning(LIST_USER_COLUMNS)
    return result[0]
  }

  getUser(userId: number): Promise<UserRow> {
    return this.knex<UserRow>('users').first().where({ userId }).select(ALL_USER_COLUMNS)
  }

  async updateUser(userId: number, updatedUser: UpdateUserRow): Promise<UserRow> {
    const updatedColumns = pickWithoutUndefined(updatedUser, UPDATEABLE_USER_COLUMNS)

    const result = await this.knex<UserRow>('users')
      .where({ userId })
      .update(updatedColumns)
      .returning(LIST_USER_COLUMNS)
    return result[0]
  }

  async updateUserPassword(userId: number, updatedPasswordHash: string): Promise<UserRow> {
    const result = await this.knex<UserRow>('users')
      .where({ userId })
      .update({ passwordHash: updatedPasswordHash })
      .returning(LIST_USER_COLUMNS)
    return result[0]
  }
}

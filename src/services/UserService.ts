import { hash } from 'bcrypt'
import { pickWithoutUndefined } from 'knex-utils'
import { Dependencies } from '../infrastructure/diConfig'
import { UserRepository } from '../repositories/UserRepository'

const SALT_ROUNDS = 10

export type NewUserDto = {
  username: string
  email: string
  password: string
  departmentId?: number
  isBlocked: boolean
}

export type UserDto = {
  userId: number
  username: string
  email: string
  departmentId?: number
  isBlocked: boolean
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  private readonly userRepository: UserRepository

  constructor({ userRepository }: Dependencies) {
    this.userRepository = userRepository
  }

  async createUser(newUser: NewUserDto): Promise<UserDto> {
    const passwordHash = await hash(newUser.password, SALT_ROUNDS)
    const userProperties = pickWithoutUndefined(newUser, [
      'username',
      'email',
      'departmentId',
      'isBlocked',
    ])

    const result = await this.userRepository.createUser({
      ...userProperties,
      passwordHash,
    })

    return result
  }
}

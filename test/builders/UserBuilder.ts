import { UserDto, UserService } from '../../src/services/UserService'
import { Dependencies } from '../../src/infrastructure/diConfig'

export class UserBuilder {
  private _username: string
  private _password: string
  private _isBlocked: boolean
  private _email: string

  private readonly userService: UserService

  public constructor({ userService }: Dependencies) {
    this._username = 'testuser'
    this._password = 'pass'
    this._isBlocked = false
    this._email = 'tuser@test.lt'

    this.userService = userService
  }

  public username(username: string): UserBuilder {
    this._username = username
    return this
  }
  public password(password: string): UserBuilder {
    this._password = password
    return this
  }

  public isBlocked(isBlocked: boolean): UserBuilder {
    this._isBlocked = isBlocked
    return this
  }
  public email(email: string): UserBuilder {
    this._email = email
    return this
  }

  public async build(): Promise<UserDto> {
    const newUser = await this.userService.createUser({
      username: this._username,
      password: this._password,
      isBlocked: this._isBlocked,
      email: this._email,
    })

    return newUser
  }
}

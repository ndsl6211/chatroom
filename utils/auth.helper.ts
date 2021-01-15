import * as data from '../statics/users.json'
import { User } from '../interfaces/interface'

export function validateUser(username: string, password: string): string {
  var users: User[] = data.users

  var loginUserName: string = null
  users.forEach((user, idx, arr) => {
    if (user.name == username && user.password == password) {
      loginUserName = user.name
    }
  })

  return loginUserName
}
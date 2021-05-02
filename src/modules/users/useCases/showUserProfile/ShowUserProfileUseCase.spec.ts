import { describe, it, expect } from '@jest/globals'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { ShowUserProfileError } from './ShowUserProfileError'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

describe('ShowUserProfileUseCase', () => {
  it('should throw an error if user not found', () => {
    const usersRepository = new InMemoryUsersRepository()
    const showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)

    expect(showUserProfileUseCase.execute('invalid_user_id')).rejects.toBeInstanceOf(ShowUserProfileError)
  })

  it('should show user profile on success', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: 'password'
    }

    const { id: user_id } = await usersRepository.create(user)
    const result = await showUserProfileUseCase.execute(String(user_id))

    expect(result.id).toBe(user_id)
    expect(result.name).toBe(user.name)
    expect(result.email).toBe(user.email)
  })
})

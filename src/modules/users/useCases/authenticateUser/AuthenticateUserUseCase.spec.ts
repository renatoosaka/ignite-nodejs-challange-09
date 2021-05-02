import { describe, it, expect } from '@jest/globals'
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

describe('AuthenticateUserUseCase', () => {
  it('should throw an error if email not found', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const autheticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    const user = {
      email: 'user@email.com',
      password: 'password'
    }

    expect(autheticateUserUseCase.execute(user)).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should throw an error if password does not match', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const autheticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: 'password'
    }

    await usersRepository.create(user)

    expect(autheticateUserUseCase.execute({
      email: user.email,
      password: 'wrong'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should return an user and a token on success', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const autheticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    await usersRepository.create(user)

    const result = await autheticateUserUseCase.execute({
      email: user.email,
      password: 'password'
    })

    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('token')
    expect(result.user.email).toBe(user.email)
  })
})

import { describe, it, expect } from '@jest/globals'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

describe('CreateUSerUseCase', () => {
  it('should not create an user with email already in use', async () => {
    const userRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: 'password'
    }

    await createUserUseCase.execute(user)

    expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(CreateUserError)
  })

  it('should create an user on success', async () => {
    const userRepository = new InMemoryUsersRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: 'password'
    }

    const result = await createUserUseCase.execute(user)

    expect(result.name).toBe(user.name)
    expect(result.email).toBe(user.email)
  })
})

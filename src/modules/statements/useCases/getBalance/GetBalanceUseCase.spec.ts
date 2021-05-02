import { describe, it, expect } from '@jest/globals'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '../../entities/Statement'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import { GetBalanceError } from './GetBalanceError'
import { GetBalanceUseCase } from './GetBalanceUseCase'

describe('GetBalanceUseCase', () => {
  it('should throw an error if user not found', () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)

    expect(getBalanceUseCase.execute({
      user_id: 'user_id'
    })).rejects.toBeInstanceOf(GetBalanceError)
  })

  it('should return balance on success', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    const getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    const { id: user_id } = await usersRepository.create(user)

    await createStatementUseCase.execute({
      user_id: String(user_id),
      amount: 10.00,
      description: 'description deposit',
      type: OperationType.DEPOSIT
    })

    await createStatementUseCase.execute({
      user_id: String(user_id),
      amount: 5.00,
      description: 'description withdraw',
      type: OperationType.WITHDRAW
    })

    const result = await getBalanceUseCase.execute({ user_id: String(user_id) })

    expect(result.balance).toBe(5.00)
    expect(result.statement.length).toBe(2)
  })
})

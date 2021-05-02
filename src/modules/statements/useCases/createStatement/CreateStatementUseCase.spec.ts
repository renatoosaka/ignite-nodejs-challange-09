import { describe, it, expect } from '@jest/globals'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '../../entities/Statement'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementError } from './CreateStatementError'
import { CreateStatementUseCase } from './CreateStatementUseCase'

describe('CreateStatementUseCase', () => {
  it('should throw an error if user not found', () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)

    expect(createStatementUseCase.execute({
      user_id: 'user_id',
      amount: 1.00,
      description: 'description',
      type: OperationType.DEPOSIT
    })).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should throw an error if withdraw an insufficient amount', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    const { id: user_id } = await usersRepository.create(user)

    expect(createStatementUseCase.execute({
      user_id: String(user_id),
      amount: 1.00,
      description: 'description',
      type: OperationType.WITHDRAW
    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it('should create a statement on success', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    const { id: user_id } = await usersRepository.create(user)

    const deposit = await createStatementUseCase.execute({
      user_id: String(user_id),
      amount: 10.00,
      description: 'description deposit',
      type: OperationType.DEPOSIT
    })

    expect(deposit.amount).toBe(10.00)
    expect(deposit.type).toBe(OperationType.DEPOSIT)
    expect(deposit.user_id).toBe(user_id)

    const withdraw = await createStatementUseCase.execute({
      user_id: String(user_id),
      amount: 5.00,
      description: 'description withdraw',
      type: OperationType.WITHDRAW
    })

    expect(withdraw.amount).toBe(5.00)
    expect(withdraw.type).toBe(OperationType.WITHDRAW)
    expect(withdraw.user_id).toBe(user_id)
  })
})

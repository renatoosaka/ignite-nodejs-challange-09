import { describe, it, expect } from '@jest/globals'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '../../entities/Statement'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import { GetStatementOperationError } from './GetStatementOperationError'
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

describe('GetStatementOperationUseCase', () => {
  it('should throw an error if user not found', () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)

    expect(getStatementOperationUseCase.execute({
      user_id: 'user_id',
      statement_id: 'statement_id'
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should throw an error if statement not found', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    const { id: user_id } = await usersRepository.create(user)

    expect(getStatementOperationUseCase.execute({
      user_id: String(user_id),
      statement_id: 'statement_id'
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it('should return a statement on success', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    const getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    const { id: user_id } = await usersRepository.create(user)

    const statement = await createStatementUseCase.execute({
      user_id: String(user_id),
      amount: 10.00,
      description: 'description deposit',
      type: OperationType.DEPOSIT
    })

    const result =  await getStatementOperationUseCase.execute({
      user_id: String(user_id),
      statement_id: String(statement.id)
    })

    expect(result.amount).toBe(10.00)
    expect(result.id).toBe(statement.id)
    expect(result.type).toBe(OperationType.DEPOSIT)
  })
})

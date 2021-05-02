import { describe, it, expect } from '@jest/globals'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { OperationType } from '../../entities/Statement'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import { TransferStatementError } from './TransferStatementError'
import { TransferStatementUseCase } from './TransferStatementUseCase'

describe('TransferStatementUseCase', () => {
  it('should throw an error if user not found', () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const transferStatementUseCase = new TransferStatementUseCase(usersRepository, statementsRepository)

    expect(transferStatementUseCase.execute({
      user_id: 'user_01',
      sender_id: 'sender_01',
      amount: 1.00,
      description: 'description'
    })).rejects.toBeInstanceOf(TransferStatementError.UserNotFound)
  })

  it('should throw an error if no balance', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const transferStatementUseCase = new TransferStatementUseCase(usersRepository, statementsRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    const sender = {
      name: 'Sender',
      email: 'sender@email.com',
      password: await hash('password', 8)
    }

    const { id: user_id } = await usersRepository.create(user)
    const { id: sender_id } = await usersRepository.create(sender)

    expect(transferStatementUseCase.execute({
      user_id: String(user_id),
      sender_id: String(sender_id),
      amount: 1.00,
      description: 'description'
    })).rejects.toBeInstanceOf(TransferStatementError.InsufficientFunds)
  })

  it('should create a statement on success', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository()

    const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    const transferStatementUseCase = new TransferStatementUseCase(usersRepository, statementsRepository)

    const user = {
      name: 'User',
      email: 'user@email.com',
      password: await hash('password', 8)
    }

    const sender = {
      name: 'Sender',
      email: 'sender@email.com',
      password: await hash('password', 8)
    }

    const { id: user_id } = await usersRepository.create(user)
    const { id: sender_id } = await usersRepository.create(sender)

    await createStatementUseCase.execute({
      user_id: String(sender_id),
      amount: 10.00,
      description: 'description deposit',
      type: OperationType.DEPOSIT
    })


    const transfer = await transferStatementUseCase.execute({
      amount: 4.00,
      description: 'description transfer',
      sender_id: String(sender_id),
      user_id: String(user_id)
    })

    expect(transfer.amount).toBe(4.00)
    expect(transfer.type).toBe(OperationType.TRANSFER)
    expect(transfer.user_id).toBe(user_id)
    expect(transfer.sender_id).toBe(sender_id)
  })
})

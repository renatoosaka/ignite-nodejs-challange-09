import {Request, Response} from 'express';
import { container } from 'tsyringe';
import { TransferStatementUseCase } from './TransferStatementUseCase';

export class TransferStatementController {
  async handle(request: Request, response: Response) {
    const { id: sender_id } = request.user;

    const { amount, description } = request.body;
    const { user_id } = request.params;

    const transferStatement = container.resolve(TransferStatementUseCase)

    const statement = await transferStatement.execute({
      amount, description, user_id, sender_id
    })

    return response.json(statement)
  }
}

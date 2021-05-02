import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferStatementDTO } from "./ITransferStatementDTO";
import { TransferStatementError } from "./TransferStatementError";

@injectable()
export class TransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private readonly statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, sender_id, amount, description}: ITransferStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new TransferStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new TransferStatementError.InsufficientFunds()
    }

    return this.statementsRepository.transfer({
      user_id,
      sender_id,
      amount,
      description
    })
  }
}

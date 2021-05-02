import { container } from 'tsyringe';

import { IUsersRepository } from '../../modules/users/repositories/IUsersRepository';
import { InMemoryUsersRepository } from '../../modules/users/repositories/in-memory/InMemoryUsersRepository';

import { IStatementsRepository } from '../../modules/statements/repositories/IStatementsRepository';
import { InMemoryStatementsRepository } from '../../modules/statements/repositories/in-memory/InMemoryStatementsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  InMemoryUsersRepository
);

container.registerSingleton<IStatementsRepository>(
  'StatementsRepository',
  InMemoryStatementsRepository
);

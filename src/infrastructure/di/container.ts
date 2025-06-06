import { Container } from "inversify";
import { Knex } from "knex";
import db from "../database/knex";
import { UserRepository } from "../../domain/repositories";
import { UserRepositoryImpl } from "../repositories/user.repo.impl";
import { UserModel } from "../models/user.model";
import { LoginUsecase } from "../../application/usecases/login.usecase";
import { RegisterUsecase } from "../../application/usecases/register.usecase";
import { GetUserByUuid } from "../../application/usecases/getUserByUuid";

const container = new Container();

// Bind database instance to the container
container.bind<Knex>("Knex").toConstantValue(db);

// Bind user related classes
UserModel.knex(db);
container.bind<UserRepository>('UserRepository').to(UserRepositoryImpl);

// Usecases
container.bind<LoginUsecase>('LoginUsecase').to(LoginUsecase)
container.bind<RegisterUsecase>('RegisterUsecase').to(RegisterUsecase)
container.bind<GetUserByUuid>('GetUserByUuid').to(GetUserByUuid)

export default container;
import { NextFunction, Request, Response } from "express";
import container from "../../infrastructure/di/container";
import { GetUserByUuid } from "../../application/usecases/getUserByUuid";
import { unwrapOrThrow as ut} from "../../utils";
import { UserPresenter } from "../presenter/user.presenter";
import { RegisterUsecase } from "../../application/usecases/register.usecase";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const usecase = container.get<RegisterUsecase>('RegisterUsecase');
            const result = ut(await usecase.execute(req.body))
            const data = UserPresenter.toJson(result)
            res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    }
    static async getByUuid(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const usecase = container.get<GetUserByUuid>('GetUserByUuid');
            const result = ut(await usecase.execute(req.params.uuid))
            const data = UserPresenter.agregateToJson(result)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
}
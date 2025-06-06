import { Request, Response, NextFunction } from "express";
import { LoginUsecase, TokenResponse } from "../../application/usecases/login.usecase";
import container from "../../infrastructure/di/container";
import { unwrapOrThrow as ut } from "../../utils";
import { TokenPayload } from "../../domain/types/token_payload";
import { AuthenticateToken } from "../../application/usecases/authenticateToken";
import { getToken } from "../middleware/authMiddleware";
import { RotateToken } from "../../application/usecases/rotateToken";
import { GetUserByUuid } from "../../application/usecases/getUserByUuid";
import { UserPresenter } from "../presenter/user.presenter";

export class AuthController{
    static async profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = ut(getToken(req))
            const payload: TokenPayload = ut(AuthenticateToken.execute(token))
            const usecase = container.get<GetUserByUuid>('GetUserByUuid');
            const result = ut(await usecase.execute(payload.uuid))
            const data = UserPresenter.agregateToJson(result)
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const login = container.get<LoginUsecase>('LoginUsecase')
            const tokens: TokenResponse = ut(await login.execute(req.body.username, req.body.password))
            res.status(200).json(tokens)
        } catch (error) {
            next(error)
        }
    }
    static async authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = ut(getToken(req))
            const payload: TokenPayload = ut(AuthenticateToken.execute(token))
            res.status(200).json(payload)
        } catch (error) {
            next(error)
        }
    }
    static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const newAccessToken: string = ut(RotateToken.execute(req.body.refreshToken))
            res.status(200).json(newAccessToken)
        } catch (error) {
            next(error)
        }
    }
    static logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
import { verify, TokenExpiredError } from "jsonwebtoken";
import { BaseController } from "../controllers/base.controller";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../inferfaces";
import { SimpleConsoleLogger } from "typeorm";
import { User } from "../entity/user.entity";
import { AccessToken } from "../entity/accessToken.entity";

export class AuthMiddleWare extends BaseController {
    public verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            let { authorization: token } = req.headers;
            token = token?.split(" ")?.[1];
            if (!token) {
                return this.error(res, new Error("No token provided!"), 403);
            }
            await verify(`${token}`, this.env.JWT_SECRET, async (err: any, decoded: any) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        return this.error(
                            res,
                            new Error("Unauthorized! Access Token was expired!"),
                            401
                        );
                    } else {
                        return this.error(res, err);
                    }
                }
                const acToken = await AccessToken.findOneBy({ id: decoded.token, revoke: false });
                if (!acToken) {
                    return this.error(res, new Error("token not found."), 404);
                }
                const user = await User.findOneBy({ id: decoded.id });
                if (!user) {
                    return this.error(res, new Error("username or password invalid."), 404);
                }
                req.auth = { ...user };
                req.accessTokenId = decoded.token;
                next();
            });
        } catch (error) {
            this.error(res, error);
        }
    };
}

import { Request } from "express";
import { UserInterface } from "../entity/user.entity";

export interface AuthRequest extends Request {
    auth?: UserInterface | undefined;
    accessTokenId?: number | undefined;
}

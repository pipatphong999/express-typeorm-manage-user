import { Response } from "express";
import { AuthRequest } from "../inferfaces";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
    public getProfile(req: AuthRequest, res: Response) {
        try {
            this.ok(res, { user: req.auth });
        } catch (error) {
            this.error(res, error);
        }
    }
}

import { AppDataSource } from "../data-source";
import { Response } from "express";
import { ConnectionIsNotSetError, Entity, getRepository } from "typeorm";
import Env from "../services/env";
import { EntityTarget } from "typeorm/common/EntityTarget";

export class BaseController {
    protected env: any | unknown;
    protected utils: any | unknown;
    protected getRepository = (Entity: any) => {
        return AppDataSource.getRepository(Entity);
    };
    constructor() {
        this.env = Env;
        // this.utils = utils;
        // console.log("new BaseController")
    }
    public ok(res: Response, data?: any, code = 200) {
        const result = {
            code,
            success: true,
            ...data,
        };
        return res.status(code).json(result);
    }
    public error(res: Response, err: any, statuscode: number = 500) {
        const code = +err.response?.data?.code || +err.code || statuscode;
        const message =
            err.response?.data?.errorMessage ||
            err.response?.data?.message ||
            err.message ||
            (Array.isArray(err) ? err?.map((e: any) => e.message) : err||"error");

        const result = {
            success: false,
            message: message,
        };
        return res.status(code).json(result);
    }
    public unauthorized(res: Response, data: any, code = 401) {
        const result = {
            success: true,
            data,
        };
        return res.status(code).json(result);
    }
}

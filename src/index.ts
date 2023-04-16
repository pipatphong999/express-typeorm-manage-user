import express from "express";
import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import router from "./routes";
import { User } from "./entity/user.entity";
import { ConnectionIsNotSetError } from "typeorm";
import cors from "cors";
import Env from "./services/env";
const port = Env.PORT;
const options: cors.CorsOptions = {
    origin: "*",
};

AppDataSource.initialize()
    .then(async () => {
        const app = express();
        app.use(cors(options));
        app.use(bodyParser.json());
        app.use("/api", router);
        app.listen(port);
        console.log(`Express server has started on port ${port}. Open http://localhost:${port}`);

        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            res.status(500).send({ success: false, error: err.message });
        });
    })
    .catch((error) => console.log(error));

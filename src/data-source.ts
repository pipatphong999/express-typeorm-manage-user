import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { RefreshToken } from "./entity/refreshToken.entity";
import { AccessToken } from "./entity/accessToken.entity";
import { SubMenu } from "./entity/subMenu.entity";
import { Menu } from "./entity/menu.entity";
import { Role } from "./entity/role.entity";
import { RolePermission } from "./entity/rolePermission.entity";
import { UserRole } from "./entity/userRole.entity";
import Env from "./services/env";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: Env.DB_HOST,
    port: Env.DB_PORT,
    username: Env.DB_USERNAME,
    password: Env.DB_PASSWORD,
    database: Env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, RefreshToken, AccessToken, Menu, SubMenu, Role, RolePermission, UserRole],
    migrations: [],
    subscribers: [],
    namingStrategy: new SnakeNamingStrategy(),
});

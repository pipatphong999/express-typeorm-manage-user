import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import { UserRepository } from "../repository/user.repository";
import { RefreshTokenRepository } from "../repository/refreshToken.repository";
import { MenuRepository } from "../repository/menu.repositpry";
import { BaseController } from "./base.controller";
import * as bcrypt from "bcryptjs";
import { sign, Secret, JwtPayload } from "jsonwebtoken";
import { In, IsNull } from "typeorm";
import { AuthRequest } from "../inferfaces";
import { AccessTokenRepository } from "../repository/accessToken.repositpry";
import { verify, TokenExpiredError } from "jsonwebtoken";
import * as crypto from "crypto";
import rule from "../services/rule";
import { RolePermissionRepository } from "../repository/rolePermission.repositpry";
import { any } from "joi";
import { Role } from "../entity/role.entity";
import { Menu } from "../entity/menu.entity";
// import { v4 as uuidv4 } from 'uuid';

export class AuthController extends BaseController {
    // {
    //   "username": "username",
    //   "password": "P@ssw0rd",
    //   "firstName": "firstName",
    //   "lastName": "lastName"
    // }
    public async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = rule.object({
                username: rule.string().required(),
                password: rule.string().required(),
                firstName: rule.string().required(),
                lastName: rule.string().required(),
                email: rule.string().email(),
            });
            const { username, password, firstName, lastName, email } = req.body;
            const valid = validate.validate({ username, password, firstName, lastName, email });
            if (valid.error) throw valid.error.details;
            // //check username duplicate
            const checkusername = await UserRepository.findOneBy({ username: username });
            if (checkusername) return this.error(res, new Error("username duplicate"), 409);
            if (email) {
                const checkEmail = await UserRepository.findOneBy({ email: email });
                if (checkEmail) return this.error(res, new Error("email duplicate"), 409);
            }

            // //save user to DB
            const newUser = await UserRepository.create({
                username,
                firstName,
                lastName,
                email,
                password: bcrypt.hashSync(password, 8),
            }).save();
            // await UserRepository.save(newUser);
            return this.ok(res, { user: { ...newUser, password: undefined } }, 201);
        } catch (error) {
            return this.error(res, error);
        }
    }

    public async signin(req: Request, res: Response) {
        try {
            const validate = rule.object({
                username: rule.string().required(),
                password: rule.string().required(),
            });
            const { username, password } = req.body;
            const valid = validate.validate({ username, password });
            if (valid.error) throw valid.error.details;

            // const user = await UserRepository.createQueryBuilder()
            //     .where({
            //         username: username,
            //         deletedAt: IsNull(),
            //     })
            //     .addSelect("User.password")
            //     .getOne();

            // const userCheckPass = await UserRepository.createQueryBuilder()
            //     .addSelect("User.password")
            //     .leftJoinAndSelect("User.roles", "Role")
            //     .leftJoinAndSelect("Role.rolePermissions", "RolePermission")
            //     .where({
            //         username: username,
            //         deletedAt: IsNull(),
            //     })
            //     .getOne();
            const userCheckPass = await UserRepository.createQueryBuilder()
                .addSelect("User.password")
                .where({
                    username: username,
                    deletedAt: IsNull(),
                })
                .getOne();

            if (!userCheckPass) {
                return this.error(res, new Error("username or password invalid."));
            }

            const passwordIsValid = bcrypt.compareSync(password, userCheckPass.password);
            if (!passwordIsValid) {
                return this.error(res, new Error("invalid Password"));
            }

            const user: any = await UserRepository.findOne({
                where: {
                    username: username,
                },
                relations: ["roles"],
            });
            let menus: any = [];
            if (user?.roles.length) {
                const permissionsTemp = await RolePermissionRepository.find({
                    where: {
                        role_id: In(user?.roles.map((r: Role) => r.id)),
                    },
                    relations: ["subMenu", "subMenu.menu", "menu"],
                });

                const menusTemps = permissionsTemp.map((p) => {
                    if (p.subMenu?.menu) {
                        return p.subMenu?.menu;
                    } else if (p.menu) {
                        return p.menu;
                    }
                });

                for (const menusTemp of menusTemps) {
                    const checkDupMenu = menus.findIndex((m: Menu) => m.id === menusTemp?.id);
                    if (checkDupMenu < 0) {
                        menus.push({ ...menusTemp });
                    }
                }

                // console.log("menus", menus);
                menus = menus.filter((value: any, index: any, array: any) => {
                    return array.indexOf(value) === index;
                });

                for (const menu of menus) {
                    const subMenuOfMenu = permissionsTemp.filter(
                        (p) => p.subMenu?.menu_id === menu?.id
                    );
                    const newsubMenu: any = [];
                    for (const subMenu of subMenuOfMenu) {
                        const indexCheckDupSubMenu = newsubMenu.findIndex(
                            (sub: any) => sub.id === subMenu.subMenu?.id
                        );
                        // console.log("indexCheckDupSubMenu", indexCheckDupSubMenu);
                        // console.log("subMenu", subMenu.subMenu.name);
                        if (indexCheckDupSubMenu > -1) {
                            newsubMenu[indexCheckDupSubMenu].permission = {
                                can_view:
                                    newsubMenu[indexCheckDupSubMenu].permission.can_view ||
                                    subMenu.can_view,
                                can_create:
                                    newsubMenu[indexCheckDupSubMenu].permission.can_create ||
                                    subMenu.can_create,
                                can_update:
                                    newsubMenu[indexCheckDupSubMenu].permission.can_update ||
                                    subMenu.can_update,
                                can_delete:
                                    newsubMenu[indexCheckDupSubMenu].permission.can_delete ||
                                    subMenu.can_delete,
                            };
                        } else {
                            const tempSubMenu: any = { ...subMenu.subMenu };
                            delete tempSubMenu.menu;
                            newsubMenu.push({
                                ...tempSubMenu,
                                permission: {
                                    can_view: subMenu.can_view,
                                    can_create: subMenu.can_create,
                                    can_update: subMenu.can_update,
                                    can_delete: subMenu.can_delete,
                                },
                            });
                        }
                    }
                    if (menu) menu.subMenus = newsubMenu;
                }
            }

            const token = await this.generateToken(user);

            return this.ok(res, {
                user: {
                    ...user,
                    menus,
                    password: undefined,
                },
                token,
            });
        } catch (error) {
            return this.error(res, error);
        }
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const validate = rule.object({
                refreshToken: rule.string().required(),
            });
            const { refreshToken } = req.body;
            const valid = validate.validate({ refreshToken });
            if (valid.error) throw valid.error.details;

            // check refreshtoken has in database
            const oldRefreshToken = await RefreshTokenRepository.findOne({
                where: {
                    token: refreshToken,
                    revoke: false,
                },
                relations: ["user"],
            });
            if (!oldRefreshToken) {
                return this.error(res, new Error("refreshToken not found in database"));
            }
            // refreshtoken expired check
            if (oldRefreshToken.expiryDate.getTime() < new Date().getTime()) {
                await oldRefreshToken.remove();
                return this.error(res, new Error("refresh token was expired"));
            }
            if (oldRefreshToken.user) {
                this.ok(res, {
                    token: await this.generateToken(oldRefreshToken.user, oldRefreshToken.token),
                });
            } else {
                this.error(res, new Error("refresh token not found user"));
            }
        } catch (error) {
            return this.error(res, error);
        }
    }

    public async signout(req: AuthRequest, res: Response) {
        try {
            const token = await AccessTokenRepository.findOneBy({ id: req.accessTokenId });
            if (token) {
                token.revoke = true;
                token.save();
                this.ok(res);
            } else {
                this.error(res, new Error("token not found"), 404);
            }
        } catch (error) {
            this.error(res, error);
        }
    }

    private async generateToken(user: User | null, oldRefreshToken: string = "") {
        try {
            if (!user) {
                return {};
            }
            const saveAccessToken = await AccessTokenRepository.create({
                userId: user.id,
            }).save();
            const accessToken = sign(
                { id: user.id, token: saveAccessToken.id },
                this.env.JWT_SECRET,
                {
                    expiresIn: this.env.JWT_EXPIRES,
                }
            );

            let token = { accessToken, refreshToken: "" };
            if (oldRefreshToken) {
                token.refreshToken = oldRefreshToken;
            } else {
                let expiredAt = new Date();
                expiredAt.setSeconds(expiredAt.getSeconds() + this.env.JWT_REFRESH_EXPIRES);
                const newRefreshtoken = crypto.randomBytes(32).toString("hex");
                const refreshToken = await RefreshTokenRepository.create({
                    expiryDate: expiredAt,
                    userId: user.id,
                    token: newRefreshtoken,
                }).save();
                token.refreshToken = refreshToken.token;
            }
            return token;
        } catch (error) {
            throw error;
        }
    }
}

import { AccessToken } from "../entity/accessToken.entity";
import { AppDataSource } from "../data-source";

export const AccessTokenRepository = AppDataSource.getRepository(AccessToken);

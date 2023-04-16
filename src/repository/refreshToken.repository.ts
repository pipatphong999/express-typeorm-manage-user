import { RefreshToken } from "../entity/refreshToken.entity";
import { AppDataSource } from "../data-source";

export const RefreshTokenRepository = AppDataSource.getRepository(RefreshToken);

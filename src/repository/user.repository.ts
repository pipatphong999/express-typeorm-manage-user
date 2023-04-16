import { User } from "../entity/user.entity";
import { AppDataSource } from "../data-source";

export const UserRepository = AppDataSource.getRepository(User);

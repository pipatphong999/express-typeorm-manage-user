import { Menu } from "../entity/menu.entity";
import { AppDataSource } from "../data-source";

export const MenuRepository = AppDataSource.getRepository(Menu);

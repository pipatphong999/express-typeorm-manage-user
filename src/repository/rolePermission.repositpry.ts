import { RolePermission } from "../entity/rolePermission.entity";
import { AppDataSource } from "../data-source";

export const RolePermissionRepository = AppDataSource.getRepository(RolePermission);

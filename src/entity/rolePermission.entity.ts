import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    Column,
    BaseEntity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
} from "typeorm";
import { User } from "./user.entity";
import { AppDataSource } from "../data-source";
import { Menu } from "./menu.entity";
import { Role } from "./role.entity";
import { SubMenu } from "./subMenu.entity";

@Entity("role_permissions")
export class RolePermission extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    can_view: boolean;

    @Column()
    can_create: boolean;

    @Column()
    can_update: boolean;

    @Column()
    can_delete: boolean;

    @Column({ nullable: true })
    sub_menu_id: number;

    @Column({ nullable: true })
    menu_id: number;

    @Column()
    role_id: number;

    @Column()
    resource_key: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne(() => Role, (role) => role.rolePermissions)
    role: Role;

    @ManyToOne(() => SubMenu, (subMenu) => subMenu.rolePermissions)
    subMenu: SubMenu;

    @ManyToOne(() => Menu, (menu) => menu.rolePermissions)
    menu: Menu;
}

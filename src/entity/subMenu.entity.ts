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
} from "typeorm";
import { User } from "./user.entity";
import { AppDataSource } from "../data-source";
import { Menu } from "./menu.entity";
import { RolePermission } from "./rolePermission.entity";

@Entity("sub_menus")
export class SubMenu extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    menu_id: number;

    @Column({ type: "text" })
    icon: string;

    @Column({ type: "longtext" })
    url: string;

    @Column({
        nullable: true,
    })
    sort: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @ManyToOne((type) => Menu, (menu: Menu) => menu.subMenu)
    menu: Menu;

    @OneToMany(
        (type) => RolePermission,
        (rolePermissions: RolePermission) => rolePermissions.subMenu
    )
    rolePermissions: RolePermission;
}

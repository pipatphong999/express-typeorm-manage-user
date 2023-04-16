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
import { SubMenu } from "./subMenu.entity";
import { RolePermission } from "./rolePermission.entity";

@Entity("menus")
export class Menu extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

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

    @OneToMany(() => SubMenu, (subMenu) => subMenu.menu)
    subMenu: SubMenu[];

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.menu)
    rolePermissions: RolePermission[];
}

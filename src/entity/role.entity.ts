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
    ManyToMany,
} from "typeorm";
import { User } from "./user.entity";
import { AppDataSource } from "../data-source";
import { Menu } from "./menu.entity";
import { RolePermission } from "./rolePermission.entity";

@Entity("roles")
export class Role extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    name_th: string;

    @Column({ type: "text" })
    name_en: string;

    @Column({ type: "text" })
    key: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[];

    @ManyToMany(() => User, (user) => user.roles, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    })
    users?: User[];
}

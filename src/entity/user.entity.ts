import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    Column,
    BaseEntity,
    OneToMany,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { AccessToken } from "./accessToken.entity";
import { RefreshToken } from "./refreshToken.entity";
import { Role } from "./role.entity";
import { UserRole } from "./userRole.entity";
// import { Transaction } from "./transaction.entity";
@Entity("users")
export class User extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    @Generated("uuid")
    uuid: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.user)
    refreshTokens: RefreshToken[];

    @OneToMany((type) => AccessToken, (accessToken) => accessToken.user)
    accessTokens: AccessToken[];

    @ManyToMany((type) => Role)
    @JoinTable({
        name: "user_roles", // table name for the junction table of this relation
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id",
        },
    })
    roles: Role[];
}
export interface UserInterface {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

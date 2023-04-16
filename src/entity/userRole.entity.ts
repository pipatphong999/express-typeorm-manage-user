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
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { AccessToken } from "./accessToken.entity";
import { RefreshToken } from "./refreshToken.entity";
import { User } from "./user.entity";
// import { Transaction } from "./transaction.entity";
@Entity("user_roles")
export class UserRole extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    // @PrimaryGeneratedColumn()
    // id: number;
    
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    role_id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
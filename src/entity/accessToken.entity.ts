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
} from "typeorm";
import { User } from "./user.entity";
import { AppDataSource } from "../data-source";

@Entity("access_tokens")
export class AccessToken extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId: number;

    @Column({ default: false })
    revoke: Boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user: User) => user.accessTokens)
    user: User;
}

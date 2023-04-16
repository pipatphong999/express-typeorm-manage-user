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

@Entity("refresh_tokens")
export class RefreshToken extends BaseEntity {
    // @PrimaryGeneratedColumn("uuid")
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    expiryDate: Date;

    @Column()
    userId: number;

    @Column()
    token: string;

    @Column({ default: false })
    revoke: Boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user: User) => user.refreshTokens)
    user: User;
}

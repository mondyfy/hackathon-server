import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity({ name: 'token' })
export class Token extends BaseEntity {
    @Column({ name: 'token', type: 'varchar', length: 1700, default: 'USER' })
    token: string;
    
    @Column({ name: 'expires', type: 'timestamptz', nullable: false })
    expires: Date;

    @Column({ name: 'type', type: 'varchar', default: 'access' })
    type: Date;

    @Column({ name: 'blacklisted', type: 'boolean', default: false })
    blacklisted: boolean;

    @ManyToOne(() => User, user => user.tokens)
    @JoinColumn({ name: 'user_id' })
    user: User; 
}
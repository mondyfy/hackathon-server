import { Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryColumn({ generated: true })
    id: number;
    
    @Column({ name: 'is_archived', type: 'boolean', default: false })
    isArchived: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
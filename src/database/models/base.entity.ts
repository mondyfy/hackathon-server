import { ApiProperty } from '@nestjs/swagger';
import { Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

export abstract class BaseEntity {
    @ApiProperty()
    @PrimaryColumn({ generated: true })
    id: number;
    
    @ApiProperty()
    @Column({ name: 'is_archived', type: 'boolean', default: false })
    isArchived: boolean;

    @ApiProperty()
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
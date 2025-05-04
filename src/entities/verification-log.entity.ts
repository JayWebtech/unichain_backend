// src/modules/verification_logs/entities/verification-log.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * Database entity for verification logs
 * Maps to the 'verification_logs' table in PostgreSQL
 */
@Entity('verification_logs') // Explicit table name
export class VerificationLog {
  /**
   * Auto-incremented primary key
   * @example 1
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Website domain being verified
   * @example "example.com"
   */
  @Column({ type: 'varchar', length: 255 })
  website_domain: string;

  /**
   * Verification status
   * @example "verified", "pending", "failed"
   */
  @Column({ type: 'varchar', length: 50 })
  status: string;

  /**
   * Optional certificate reference
   * @example "cert_12345"
   */
  @Column({ name: 'certificate_id', type: 'varchar', length: 100, nullable: true })
  certificate_id?: string;

  /**
   * Auto-generated creation timestamp
   * @example "2024-06-01T12:00:00.000Z"
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at: Date;
}
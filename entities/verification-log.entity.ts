import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('verification_logs') // Maps to PostgreSQL table
export class VerificationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  website_domain: string; // Domain being verified

  @Column({ length: 50 })
  status: string; // e.g., 'verified', 'pending'

  @Column({ nullable: true, length: 100 })
  certificate_id?: string; // Optional certificate reference

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date; // Auto-generated timestamp
}
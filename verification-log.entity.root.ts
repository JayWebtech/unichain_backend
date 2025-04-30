// This is a copy of your VerificationLog entity to put at the project root
// for temporary use with typeorm.config.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('verification_logs')
export class VerificationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  universityId: number;

  @Column({ nullable: true })
  documentId: number;

  @Column({ nullable: true })
  documentUrl: string;

  @Column({ nullable: false })
  documentHash: string;

  @Column({ nullable: true })
  verificationStatus: string;

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  // Add any other fields your original entity has
}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class SupportRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  company: string;

  @Column()
  email: string;

  @Column('text')
  request: string;

  @Column({ default: false })
  resolved: boolean;

  @CreateDateColumn()
  created_at: Date;
}
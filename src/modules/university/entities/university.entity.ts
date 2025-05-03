import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Admin } from '../../auth/entities/admin.entity';

@Entity()
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  university_name: string;

  @Column()
  website_domain: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  accreditation_body?: string;

  @Column({ unique: true })
  university_email: string;

  @Column()
  wallet_address: string;

  @Column()
  staff_name: string;

  @Column()
  job_title: string;

  @Column()
  phone_number: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @OneToMany(() => Admin, (admin) => admin.university)
  admins?: Admin[];
}

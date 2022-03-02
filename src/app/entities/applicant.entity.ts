// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Applicant extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, { nullable: false })
  interviewer: User;

  @Column()
  interviewID: string;

  @Column()
  name: string;
  
  @Column()
  email: string;

  @Column()
  completedInterview: boolean;
  
  @Column()
  startedAt: string

  @Column()
  endedAt: string

  @Column()
  category: string

}

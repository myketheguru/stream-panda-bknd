// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Applicant } from '.';

@Entity()
export class Interview extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  
  @OneToOne(type => Applicant, { nullable: false })
  participant: Applicant;

  @Column()
  interviewerID: number

  @Column()
  completed: boolean


}

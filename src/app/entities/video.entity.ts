// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Applicant } from '.';

@Entity()
export class Video extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Applicant, { nullable: false })
  author: Applicant;

  @Column()
  link: string;
  
  @Column()
  questionID: number;

}

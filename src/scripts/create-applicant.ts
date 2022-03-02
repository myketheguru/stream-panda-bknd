import { createConnection } from 'typeorm';
import { Applicant, User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    interviewerID: { type: 'number', maxLength: 255 },
    email: { type: 'string', format: 'email', maxLength: 255 },
    name: { type: 'string', maxLength: 255 },
    completedInterview: { type: 'boolean', },
  },
  required: [ 'interviewerID', 'email', ],
  type: 'object',
};

export async function main(args: { interviewerID: number, email: string, name?: string, completed?: boolean }) {
  const connection = await createConnection();

  const interviewer = await User.findOneOrFail({ id: args.interviewerID });

  const applicant = new Applicant();
  applicant.interviewer = interviewer;
  applicant.email = args.email;
  applicant.name = args.name ?? '';
  applicant.completedInterview = args.completed ?? false;

  try {
    console.log(await applicant.save());
  } catch (error) {
    console.error(error);
  } finally {
    await connection.close();
  }
}

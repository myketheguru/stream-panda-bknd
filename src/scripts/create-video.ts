import { createConnection } from 'typeorm';
import { Video, Applicant } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    author: { type: 'string', format: 'email', maxLength: 255 },
    link: { type: 'string', maxLength: 255 },
    questionID: { type: 'number', maxLength: 255 },
  },
  required: [ 'author', 'link', 'questionID' ],
  type: 'object',
};

export async function main(args: { author: string, link: string, questionID: number }) {
  const connection = await createConnection();

  const applicant = await Applicant.findOneOrFail({ email: args.author });

  const video = new Video();
  video.author = applicant;
  video.link = args.link;
  video.questionID = args.questionID;

  try {
    console.log(await video.save());
  } catch (error) {
    console.error(error);
  } finally {
    await connection.close();
  }
}

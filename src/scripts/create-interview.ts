import { createConnection } from 'typeorm';
import { Question, User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    author: { type: 'string', format: 'email', maxLength: 255 },
    category: { type: 'string', maxLength: 255 },
    question: { type: 'string', maxLength: 255 },
  },
  required: [ 'author', 'category', 'question' ],
  type: 'object',
};

export async function main(args: { author: string, category: string, question: string }) {
  const connection = await createConnection();

  const user = await User.findOneOrFail({ email: args.author });

  const question = new Question();
  question.author = user;
  question.category = args.category;
  question.question = args.question;

  try {
    console.log(await question.save());
  } catch (error) {
    console.error(error);
  } finally {
    await connection.close();
  }
}

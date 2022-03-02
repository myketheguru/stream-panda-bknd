import { Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, HttpResponseUnauthorized, Post, Session, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam, verifyPassword } from '@foal/core';
import { Question, User } from '../../entities';

const credentialsSchema = {
  type: 'object',
  properties: {
    author: { type: 'string', format: 'email', maxLength: 255 },
    category: { type: 'string' },
    question: { type: 'string' },
  },
  required: [ 'author', 'category', 'question' ],
  additionalProperties: false,
};

export class QuestionsController {
  @Get()
  @ValidateQueryParam('category', { type: 'string' }, { required: false })
  async readQuestions(ctx: Context) {
    const category = ctx.request.query.category as number|undefined;

    let queryBuilder = Question
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      .select([
        'question.id',
        'question.question',
        'question.category',
        'author.id',
      ]);

    if (category !== undefined) {
      queryBuilder = queryBuilder.where('question.category = :category', { category });
    }

    const questions = await queryBuilder.getMany();

    return new HttpResponseOK(questions);
  }
  
  @Get('/get/:id')
  @ValidatePathParam('id', { type: 'number' })
  async readOneQuestion(ctx: Context, { id } : { id: number }) {
    const question = await Question.findOne({ id });
    return new HttpResponseOK(question);
  }

  @Post('/create')
  @ValidateBody(credentialsSchema)
  @UserRequired()
  async create(ctx: Context) {
    console.log(
     ctx.request.body.category
    );
    
    const question = new Question()
    question.category = ctx.request.body.category
    question.question = ctx.request.body.question

    question.author = ctx.user;
    await question.save();

    return new HttpResponseCreated();
  }

  @Delete('/:category')
  @ValidatePathParam('category', { type: 'string' })
  @UserRequired()
  async deleteQuestions(ctx: Context<User>, { category }: { category: string }) {
    // Only retrieve stories whose author is the current user.
    const questions = await Question.find({ category: category, author: ctx.user });

    if (!questions) {
      return new HttpResponseNotFound();
    } else {
      for (let i = 0; i < questions.length; i++) {
        await questions[i].remove();
      }
      return new HttpResponseNoContent();
    }
  }

  @Delete('/remove/:id')
  @ValidatePathParam('id', { type: 'number' })
  @UserRequired()
  async deleteQuestion(ctx: Context<User>, { id }: { id: number }) {
    // Only retrieve stories whose author is the current user.
    const question = await Question.findOne({ id: id, author: ctx.user });

    if (!question) {
      return new HttpResponseNotFound();
    } 
        
    await question.remove();
    return new HttpResponseNoContent();
  }
}

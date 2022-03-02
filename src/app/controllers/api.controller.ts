import { ApiInfo, ApiServer, Context, controller, Get, HttpResponseOK, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { OpenapiController } from '.';
import { User } from '../entities';
import { ApplicantsController, AuthController, ProfileController, QuestionsController, VideosController } from './api';


@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})
@ApiServer({
  url: '/api'
})
@UseSessions({
  cookie: true,
  user: fetchUser(User),
  userCookie: (ctx: Context<User|undefined>) => ctx.user ? JSON.stringify({ id: ctx.user.id, name: ctx.user.name }) : '',
})
export class ApiController {
  subControllers = [
    controller('/applicants', ApplicantsController),
    controller('/videos', VideosController),
    controller('/questions', QuestionsController),
    controller('/swagger', OpenapiController),
    controller('/auth', AuthController),
    controller('/profile', ProfileController)
  ];


  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}

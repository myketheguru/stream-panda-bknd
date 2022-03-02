import { Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam } from '@foal/core';
import { Video, Applicant, User } from '../../entities';

export class VideosController {

  @Get()
  @ValidateQueryParam('applicantID', { type: 'string' }, { required: false })
  @UserRequired()
  async readStories(ctx: Context) {
    const applicantID = ctx.request.query.applicantID as number|undefined;

    let queryBuilder = Video
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.author', 'author')
      .select([
        'video.id',
        'video.link',
        'video.questionID',
        'author.id',
        'author.email',
        'author.name'
      ]);

    if (applicantID !== undefined) {
      queryBuilder = queryBuilder.where('video.author.id = :applicantID', { applicantID });
    }

    const videos = await queryBuilder.getMany();

    return new HttpResponseOK(videos);
  }

  @Post()
  @ValidateBody({
    type: 'object',
    properties: {
      author: { type: 'string', format: 'email', maxLength: 255 },
      link: { type: 'string', maxLength: 255 },
      questionID: { type: 'number' },
    },
    required: [ 'author', 'link', 'questionID' ],
    additionalProperties: false,
  })
  async createVideo(ctx: Context) {
    const video = new Video();
    const applicant = await Applicant.findOne({ email: ctx.request.body.author })
    if (!applicant) {
      return new HttpResponseNotFound();
    }
    
    video.author = ctx.request.body.author;
    video.link = ctx.request.body.link;
    video.questionID = ctx.request.body.questionID;
    // Set the current user as the author of the video.
    video.author = applicant;
    await video.save();

    return new HttpResponseCreated();
  }

  @Delete('/:videoID')
  @ValidatePathParam('videoID', { type: 'number' })
  @UserRequired()
  async deleteStory(ctx: Context, { videoID }: { videoID: number }) {
    const video = await Applicant.findOne({ id: videoID });

    if (!video) {
      return new HttpResponseNotFound();
    }

    await video.remove();

    return new HttpResponseNoContent();
  }

}
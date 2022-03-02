import { Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, HttpResponseUnauthorized, Post, Session, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam, verifyPassword } from '@foal/core';
import { Applicant, Interview, User } from '../../entities';
import { v4 as uuid } from 'uuid';
import nodemailer from 'nodemailer'


const nodemailer = require('nodemailer');
  
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'darkmyketheguru@gmail.com',
        pass: 'uosmmruizpvwlsux'
    }
});

const credentialsSchema = {
  type: 'object',
  properties: {
    interviewer: { type: 'number' },
    email: { type: 'string', format: 'email', maxLength: 255 },
    name: { type: 'string' },
    completed: { type: 'boolean' },
    category: { type: 'string' },
  },
  required: [ 'interviewer', 'email', 'name' ],
  additionalProperties: false,
};

export class ApplicantsController {
  @Get()
  @ValidateQueryParam('interviewerID', { type: 'number' }, { required: true })
  @UserRequired()
  async getApplicants(ctx: Context<User>) {
    const interviewerID = ctx.request.query.interviewerID as number|undefined;

    let queryBuilder = Applicant
      .createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.interviewer', 'interviewer')
      .select([
        'applicant.id',
        'applicant.interviewer',
        'applicant.email',
        'applicant.name',
        'interviewer.id',
        'interviewer.email'
      ]);

    if (interviewerID !== undefined) {
      queryBuilder = queryBuilder.where('interviewer.id = :interviewerID', { interviewerID });
    }

    const applicants = await queryBuilder.getMany();

    return new HttpResponseOK(applicants);
  }

  @Post('/create')
  @ValidateBody(credentialsSchema)
  @UserRequired()
  async createApplicant(ctx: Context) {
    let applicant = await Applicant.findOne({ email: ctx.request.body.email })
    if (!applicant) {
      applicant = new Applicant()
    }
    applicant.interviewer = ctx.request.body.interviewer;
    applicant.email = ctx.request.body.email;
    applicant.name = ctx.request.body.name;
    applicant.interviewID = uuid()
    applicant.completedInterview = false
    applicant.category = ctx.request.body.category
    applicant.startedAt = ''
    applicant.endedAt = ''
    

    applicant.interviewer = ctx.user;
    await applicant.save();


    let interviewURL = `http://localhost:3000/interview?participant=${applicant.email}&interviewID=${applicant.interviewID}`

    let mailDetails = {
      from: 'Interview Invite <streampandaonline@gmail.com>',
      to: `${applicant.email}`,
      subject: `Invitation to interview for ${ctx.request.body.category.toUpperCase()} role`,
      html: `
        <div>
          <h3>Hello ${applicant.name},</h3>
          <p>You have been invited to interview for a ${ctx.request.body.category.toUpperCase()} role</p>
          <p>Please click on the link below to start. We wish you best of luck</p>
          <a 
            style="background-color: dodgerblue;color: white; padding: 10px 15px; border-radius: 50px; text-decoration: none; margin-bottom: 10px; display: inline-block"
            href="${interviewURL}">Start Interview</a><br />
            <p>
              Or copy the link below and paste it in your browser <br />
              ${interviewURL}
            </p>
            <br />

          <small>This interview will expire in 5 days</small>
      </div>
      `
    };


    mailTransporter.sendMail(mailDetails, function(err, data) {
      if(err) {
          console.log(err);
          console.log('Error Occurs');
      } else {
          console.log('Email sent successfully>>>>>>>>>');
      }
    });


    return new HttpResponseCreated({
      id: applicant.id,
      email: applicant.email,
      completedInterview: applicant.completedInterview,
      interviewer: applicant.interviewer.id
    });
  }
  
  @Get('/verify/:email/:id')
  @ValidatePathParam('id', { type: 'number' })  
  @ValidatePathParam('email', { type: 'string', format: 'email', },)  
  async verify(ctx: Context, { id, email } : { id: number, email: string }) {
    const applicant = await Applicant.findOne({ id, email })
    if (!applicant) {
      return new HttpResponseNotFound();
    }
    
    return new HttpResponseOK({ ok: true });
  }

  @Delete('/:id')
  @ValidatePathParam('id', { type: 'number' })
  @UserRequired()
  async deleteQuestions(ctx: Context<User>, { id }: { id: number }) {
    // Only retrieve stories whose author is the current user.
    const applicant = await Applicant.findOne({ id });

    if (!applicant) {
      return new HttpResponseNotFound();
    } else {
      await applicant.remove();
      return new HttpResponseNoContent();
    }
  }
}

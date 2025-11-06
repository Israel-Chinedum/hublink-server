import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  async verify(@Req() req: Request, @Res() res: Response) {
    const { message, resCode } = await this.auth.verify(
      req.cookies.refreshToken,
    );

    if (resCode === 201) {
      res.cookie('accessToken', message, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: 1000 * 60 * 30,
      });
      console.log('User: ', req.user);
      return res.status(resCode).json(req.user);
    } else {
      return res.status(resCode).json(message);
    }
  }

  @Get('/logo')
  async getLogos(@Res() res: Response, @Req() req: Request) {
    console.log('A request was just made to logo');
    console.log(req.user);
    return res.status(302).redirect('https://logo.clearbit.com/opayweb.com');
  }
}

import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get()
  async verify(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      const { message, resCode } = await this.auth.verify(
        req.cookies.refreshToken,
        req.user,
      );

      if (resCode === 200) {
        const accessToken = await this.auth.generateToken(
          'access_token',
          req.user,
        );
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: false,
          maxAge: 1000 * 60 * 30,
        });
      }
    }
  }
}

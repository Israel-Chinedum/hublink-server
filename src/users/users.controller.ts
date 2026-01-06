import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { UsersService } from './users.service';
import { loginDTO, userDTO } from './users.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly auth: AuthService,
  ) {}

  // ------ REGISTER USER ------
  @Post()
  async register(@Body() body: userDTO, @Res() res: Response) {
    const { message, resCode } = await this.userService.register(body);
    return res.status(resCode).json(message);
  }

  // ------ USER LOGIN ------

  @Post('/login')
  async login(@Body() body: loginDTO, @Res() res: Response) {
    const { message, resCode } = await this.userService.login(body);
    if (resCode == 200) {
      const user = message;
      if (user instanceof Object) {
        const accessToken = await this.auth.generateToken('access_token', user);
        const refreshToken = await this.auth.generateToken(
          'refresh_token',
          user,
        );

        // ------ SEND USER ACCESS TOKEN ------
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 30 * 60 * 1000,
        });

        // ------ SEND USER REFRESH TOKEN ------;
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        });
        await this.auth.saveRefreshToken(refreshToken, user['_id']);
      }
      return res.status(resCode).json(message);
    } else {
      return res.status(resCode).json(message);
    }
  }

  //
  @UseGuards(AuthService)
  @Patch('/edit-user-profile')
  async editUserProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: userDTO,
  ) {
    if (!req.user) return res.status(404).json('User not found!');
    const { message, resCode } = await this.userService.editUserProfile(
      body,
      req.user,
    );
    res.status(resCode).json(message);
  }
}

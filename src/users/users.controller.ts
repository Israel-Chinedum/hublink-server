import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { userDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async register(@Body() body: userDTO, @Res() res: Response) {
    const { message, resCode } = await this.userService.register(body);
    return res.status(resCode).json(message);
  }
}

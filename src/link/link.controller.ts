import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LinkDTO } from './link.dto';
import type { Request, Response } from 'express';
import { LinkService } from './link.service';
import { User } from 'src/schemas/users.schema';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @UseGuards(AuthService)
  @Post('')
  async addLink(
    @Body() body: LinkDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { message, resCode } = await this.linkService.addLink(
      body,
      req.user as User,
    );
    res.status(resCode).json(message);
  }
}

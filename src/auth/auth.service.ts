import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { msg } from '../utils/message.util';
import { Token } from 'src/schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const jwtAccess = new JwtService({
  secret: process.env.ACCESS_TOKEN,
  signOptions: { expiresIn: '30m' },
});

const jwtRefresh = new JwtService({
  secret: process.env.REFRESH_TOKEN,
  signOptions: { expiresIn: '24h' },
});

@Injectable()
export class AuthService implements CanActivate {
  filename = 'auth.service.ts';

  constructor(
    @InjectModel('tokens') private readonly tokenModel: Model<Token>,
  ) {}

  async generateToken(type: 'access_token' | 'refresh_token', user: object) {
    if (type === 'access_token') return jwtAccess.signAsync({ user });
    return jwtRefresh.sign({ user });
  }

  async saveRefreshToken(refreshToken: string, userId: string) {
    try {
      if (!refreshToken) {
        msg.stamp(this.filename, 'refreshToken must be provided!');
        return;
      }
      if (!userId) {
        msg.stamp(this.filename, 'userId must be provided!');
        return;
      }
      await this.tokenModel.deleteOne({ userId }).exec();
      await new this.tokenModel({
        userId,
        token: refreshToken,
        expiresIn: Date.now() + 24 * 60 * 60 * 1000,
      }).save();
    } catch {
      msg.stamp(this.filename, 'Unable to save refreshToken!');
    }
  }

  async verify(refreshToken: string, user: object) {
    if (!refreshToken) return msg.reply('Unauthorized access!', 401);
    try {
      await jwtRefresh.verifyAsync(refreshToken);
      return msg.reply(await this.generateToken('access_token', user), 201);
    } catch {
      return msg.reply('Invalid token!', 403);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log(req.cookies);
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) throw new UnauthorizedException('Unauthorized access!');

    try {
      req.user = await jwtAccess.verifyAsync(accessToken);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token!');
    }
  }
}

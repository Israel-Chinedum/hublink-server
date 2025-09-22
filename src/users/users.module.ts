import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/users.schema';
import { AuthService } from 'src/auth/auth.service';
import { tokenSchema } from 'src/schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'tokens', schema: tokenSchema },
    ]),
  ],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
})
export class UsersModule {}

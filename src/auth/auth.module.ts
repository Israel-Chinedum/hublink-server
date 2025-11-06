import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { tokenSchema } from 'src/schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'tokens', schema: tokenSchema }]),
  ],
  exports: [AuthService, MongooseModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

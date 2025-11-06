import { Module } from '@nestjs/common';
import { LinkController } from './link.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { linkSchema } from 'src/schemas/link.schema';
import { LinkService } from './link.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'links', schema: linkSchema }]),
    AuthModule,
  ],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}

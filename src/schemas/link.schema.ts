import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Link extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  linkName: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const linkSchema = SchemaFactory.createForClass(Link);

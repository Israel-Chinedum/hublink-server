import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link } from 'src/schemas/link.schema';
import { LinkDTO } from './link.dto';
import { User } from 'src/schemas/users.schema';
import { msg } from 'src/utils/message.util';

@Injectable()
export class LinkService {
  filename: '/link.service';

  constructor(@InjectModel('links') private readonly linkModel: Model<Link>) {}

  async addLink({ linkName, link }: LinkDTO, user: User) {
    const linkExists = await this.linkModel.findOne({ link }).exec();
    const linkNameExists = await this.linkModel.findOne({ linkName }).exec();

    if (linkExists) return msg.reply('Link already exists!', 400);

    if (linkNameExists)
      return msg.reply('This link name has already been used!', 400);

    const linkObj = {
      userId: user._id,
      linkName,
      link,
      createdAt: Date.now(),
    };

    const newLink = new this.linkModel(linkObj);
    await newLink.save();
    return msg.reply('Link has been added!', 201);
  }
}

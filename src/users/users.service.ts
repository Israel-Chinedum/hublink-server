import { Injectable } from '@nestjs/common';
import { userDTO } from './users.dto';
import { msg } from 'src/utils/message.util';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  filename = 'users.service.ts';

  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  // =====HASH PASSWORD METHOD=====
  async hashPassword(password: string, saltRounds: number) {
    try {
      if (saltRounds < 10)
        throw new Error('saltRounds must not be less than 10!');
      return bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.log('Error: ', error);
      msg.stamp(
        this.filename,
        'an error occured while trying to hash user password!',
      );
    }
  }

  // =====REGISTER METHOD=====
  async register(body: userDTO) {
    msg.stamp(this.filename, 'A registration request was just made'); // time stamp
    try {
      msg.stamp(this.filename, 'processing...'); // time stamp

      // VERIFY USER DETAILS
      // email verification
      const email = await this.userModel.findOne({ email: body.email }).exec();
      if (email) {
        msg.stamp(this.filename, 'email error: request declined ❌');
        return msg.reply('user already exists!', 400);
      }
      // phone number verification
      const phone = await this.userModel
        .findOne({ phoneNumber: body.phoneNumber })
        .exec();
      if (phone) {
        msg.stamp(this.filename, 'phoneNumber error: request declined ❌');
        return msg.reply('Mobile number already exists!', 400);
      }

      // HASH USER PASSWORD
      const hashpassword = await this.hashPassword(body.password, 10);
      hashpassword && (body.password = hashpassword);

      // STORE USER DETAILS
      const user = new this.userModel(body);
      await user.save();

      // LOG AND RETURN SUCCESS MESSAGE
      msg.stamp(this.filename, 'A new user has been created 👤');
      return msg.reply('Registration successfull ✔️', 200);
    } catch (error) {
      // LOG AND RETURN ERROR MESSAGE
      msg.stamp(this.filename, 'an error occured while trying to create user!');
      return msg.reply('Unable to register user, please try again later!', 500);
    }
  }
}

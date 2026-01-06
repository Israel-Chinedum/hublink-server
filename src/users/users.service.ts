import { Injectable } from '@nestjs/common';
import { loginDTO, userDTO } from './users.dto';
import { msg } from 'src/utils/message.util';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/users.schema';
import { Model, Types } from 'mongoose';
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
        return msg.reply('This email has already been registered!', 400);
      }

      // HASH USER PASSWORD
      const hashpassword = await this.hashPassword(body.password, 10);
      hashpassword && (body.password = hashpassword);

      // ADD DATE PROPERTY TO USER OBJECT
      body['createdAt'] = Date.now();

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

  // =====LOGIN METHOD=====
  async login(body: loginDTO) {
    msg.stamp(this.filename, 'A login request has just been made!');
    try {
      const users = await this.userModel.find().exec();
      let valid_user = {};
      for (let user of users) {
        const match = await bcrypt.compare(body.password, user.password);
        if (match && body.email === user.email) valid_user = user;
      }
      if (!Object.keys(valid_user).length)
        return msg.reply('Invalid email or password!', 400);
      return msg.reply('Login successful!', 200);
    } catch (error) {
      console.log('Error: ', error);
      msg.stamp(this.filename, 'An error occured while trying to verify user!');
      return msg.reply(
        'Unable to process login details, please try again later!',
        500,
      );
    }
  }

  // =====EDIT USER=====
  async editUserProfile(newUserDetails: userDTO, user: User) {
    msg.stamp(this.filename, 'A request to edit user profile was just made!');
    try {
      const existingUser = await this.userModel.findOne({
        email: newUserDetails.email,
      });

      if (existingUser && existingUser.email != user.email)
        return msg.reply('email already exists!', 400);

      msg.stamp(this.filename, JSON.stringify(newUserDetails));
      const hashPassword = await this.hashPassword(newUserDetails.password, 10);
      hashPassword && (newUserDetails.password = hashPassword);
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user._id,
        { $set: newUserDetails },
        { new: true },
      );
      if (updatedUser) return msg.reply(updatedUser, 200);
      throw new Error();
    } catch (error) {
      console.log('Error: ', error);
      return msg.reply('Unable to update user profile!', 500);
    }
  }
}

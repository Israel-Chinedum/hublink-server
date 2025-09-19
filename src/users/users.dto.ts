import { Expose } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class userDTO {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'First Name' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'Last Name' })
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose({ name: 'Phone Number' })
  phoneNumber: number;

  @IsNotEmpty()
  @IsDate()
  @Expose({ name: 'Date of birth' })
  DOB: Date;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class loginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

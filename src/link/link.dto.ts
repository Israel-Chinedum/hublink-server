import { IsNotEmpty, IsString } from 'class-validator';

export class LinkDTO {
  @IsNotEmpty()
  @IsString()
  linkName: string;

  @IsNotEmpty()
  @IsString()
  link: string;
}

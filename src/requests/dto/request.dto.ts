import { StatusDto } from './status.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  status: StatusDto;
  @IsNotEmpty()
  message: string;
  comment: string;
}

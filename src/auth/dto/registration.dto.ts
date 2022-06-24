import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { Match } from '../validator/match.validator';

export class Registration {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @IsNotEmpty()
  @MinLength(3)
  @Match('password')
  password_confirm: string;
}

export default Registration;

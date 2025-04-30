import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { MatchPassword } from '../validators/password.validator';
export class SignupAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Validate(MatchPassword, ['password'])
  passwordConfirm: string;
}
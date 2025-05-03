import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { MatchPassword } from '../validators/password.validator';
import { Role } from '../entities/admin.entity';
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

  @IsEnum(Role)
  role?: Role.ADMIN | Role.SUPER_ADMIN;
}

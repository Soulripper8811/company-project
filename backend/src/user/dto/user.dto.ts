import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class registerDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'password must container 6 charchter' })
  password: string;
}
export class loginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'password must container 6 charchter' })
  password: string;
}

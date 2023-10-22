// import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  // @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  // @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
  })
  password: string;

  // @ApiProperty({ required: true })
  @IsNotEmpty()
  @Match(CreateUserDto, (field) => field.password, {
    message: 'Passwords must match',
  })
  confirm_password: string;
}

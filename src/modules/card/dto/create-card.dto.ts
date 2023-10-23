import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  answer: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  teacher?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  text: string;
}

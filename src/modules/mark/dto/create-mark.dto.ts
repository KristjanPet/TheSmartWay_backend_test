import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateMarkDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}

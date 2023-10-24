import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MarkService } from './mark.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { Mark } from 'src/entities/mark.entity';
import { Request } from 'express';

@ApiTags('Mark')
@Controller('mark')
export class MarkController {
  constructor(private readonly markService: MarkService) {}

  //POST

  @ApiCreatedResponse({ description: 'Create a Mark.' })
  @ApiBadRequestResponse({ description: 'Error for creating a Mark' })
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id') cardId: string,
    @Req() req: Request,
    @Body() createMarkDto: CreateMarkDto,
  ): Promise<Mark> {
    const cookie = req.cookies['access_token'];
    return this.markService.create(cookie, createMarkDto, cardId);
  }
}

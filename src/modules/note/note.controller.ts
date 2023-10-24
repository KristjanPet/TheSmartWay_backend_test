import {
  Controller,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import { NoteService } from './note.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Note } from 'src/entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { Request } from 'express';

@ApiTags('Note')
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  //GET

  @ApiCreatedResponse({ description: 'Get percent finished cards.' })
  @ApiBadRequestResponse({ description: 'Error getting precents of cards' })
  @Get(':id/percent')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<number> {
    return this.noteService.getPercent(id);
  }

  //POST

  @ApiCreatedResponse({ description: 'Create a note.' })
  @ApiBadRequestResponse({ description: 'Error for creating a note' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const cookie = req.cookies['access_token'];
    return this.noteService.create(cookie, createNoteDto);
  }
}

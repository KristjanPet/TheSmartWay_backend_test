import {
  Controller,
  Post,
  HttpCode,
  Req,
  Body,
  HttpStatus,
  Param,
  Get,
} from '@nestjs/common';
import { CardService } from './card.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Card } from 'src/entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';

@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  //GET

  @ApiCreatedResponse({ description: 'List all cards from note.' })
  @ApiBadRequestResponse({ description: 'Error getting list of cards' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findByNoteId(@Param('id') noteId: string): Promise<Card[]> {
    return await this.cardService.findByNote(noteId);
  }

  @ApiCreatedResponse({ description: 'List all cards from note with mark.' })
  @ApiBadRequestResponse({
    description: 'Error getting list of cards with mark',
  })
  @Get(':id/mark')
  @HttpCode(HttpStatus.OK)
  async findByNoteIdWithMark(@Param('id') noteId: string): Promise<Card[]> {
    return await this.cardService.findByNoteWithMark(noteId);
  }

  //POST

  @ApiCreatedResponse({ description: 'Create a card.' })
  @ApiBadRequestResponse({ description: 'Error for creating a card' })
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id') noteId: string,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return this.cardService.create(createCardDto, noteId);
  }
}

import {
  Controller,
  Post,
  HttpCode,
  Req,
  Body,
  HttpStatus,
  Param,
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

  //POST

  @ApiCreatedResponse({ description: 'Create a note.' })
  @ApiBadRequestResponse({ description: 'Error for creating a note' })
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id') noteId: string,
    @Body() createCardDto: CreateCardDto,
  ): Promise<Card> {
    return this.cardService.create(createCardDto, noteId);
  }
}

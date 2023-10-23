import { BadRequestException, Injectable } from '@nestjs/common';
import { Card } from 'src/entities/card.entity';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { NoteService } from '../note/note.service';
import Logging from 'src/library/Logging';

@Injectable()
export class CardService extends AbstractService<Card> {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    private readonly noteService: NoteService, // private readonly authService: AuthService,
  ) {
    super(cardRepository);
  }

  async create(createCardDto: CreateCardDto, noteId: string): Promise<Card> {
    try {
      const note = await this.noteService.findById(noteId);

      const card = this.cardRepository.create({ note, ...createCardDto });
      return this.cardRepository.save(card);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while creating a new note',
      );
    }
  }
}

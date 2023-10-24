import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { Note } from 'src/entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateNoteDto } from './dto/create-note.dto';
import Logging from 'src/library/Logging';
import { Card } from 'src/entities/card.entity';
import { CardService } from '../card/card.service';

@Injectable()
export class NoteService extends AbstractService<Note> {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => CardService))
    private readonly cardService: CardService,
  ) {
    super(noteRepository);
  }

  async getPercent(noteId: string): Promise<number> {
    const cards: Card[] = await this.cardService.findByNote(noteId);
    const totalCards = cards.length;
    const finishedCards = cards.filter((card) => card.finished).length;

    return (finishedCards / totalCards) * 100;
  }

  async create(cookie: string, createNoteDto: CreateNoteDto): Promise<Note> {
    try {
      const user = await this.authService.user(cookie);

      const note = this.noteRepository.create({ user, ...createNoteDto });
      return this.noteRepository.save(note);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while creating a new note',
      );
    }
  }
}

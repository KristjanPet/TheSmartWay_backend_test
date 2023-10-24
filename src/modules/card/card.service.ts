import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Card } from 'src/entities/card.entity';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { NoteService } from '../note/note.service';
import Logging from 'src/library/Logging';
import { MarkService } from '../mark/mark.service';

@Injectable()
export class CardService extends AbstractService<Card> {
  constructor(
    @InjectRepository(Card) private readonly cardRepository: Repository<Card>,
    @Inject(forwardRef(() => NoteService))
    private readonly noteService: NoteService,
    @Inject(forwardRef(() => MarkService))
    private readonly markService: MarkService,
  ) {
    super(cardRepository);
  }

  async findByNote(noteId: string): Promise<Card[]> {
    try {
      return this.cardRepository.findBy({ note: { id: noteId } });
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while searcing for cards',
      );
    }
  }

  async findByNoteWithMark(noteId: string): Promise<Card[]> {
    try {
      return await this.cardRepository
        .createQueryBuilder('card')
        .leftJoinAndSelect('card.mark', 'mark', 'mark.active = true')
        .where('card.noteId = :noteId', { noteId })
        .getMany();
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while searcing for cards',
      );
    }
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

  async reset(noteId: string): Promise<boolean | string> {
    try {
      const cards = await this.findByNote(noteId);

      // Check if all cards have `finished` set to `true`
      const allFinished = cards.every((card) => card.finished);

      if (allFinished) {
        // Update all cards to set `finished` to `false`
        await this.cardRepository.update(
          { note: { id: noteId } },
          { finished: false },
        );

        for (const card of cards) {
          await this.markService.updateActiveMarks(card.id);
        }

        return true;
      } else {
        return 'All cards must be finished before restarting';
      }
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while creating a new note',
      );
    }
  }

  async setFinished(card: Card, state: boolean) {
    try {
      this.cardRepository.update(card.id, { finished: state });
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException('something went wrong while updating card');
    }
  }
}

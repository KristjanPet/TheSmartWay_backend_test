import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Mark } from 'src/entities/mark.entity';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardService } from '../card/card.service';
import { AuthService } from '../auth/auth.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import Logging from 'src/library/Logging';
import { Card } from 'src/entities/card.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MarkService extends AbstractService<Mark> {
  constructor(
    @InjectRepository(Mark) private readonly markRepository: Repository<Mark>,
    @Inject(forwardRef(() => CardService))
    private readonly cardService: CardService,
    private readonly authService: AuthService,
  ) {
    super(markRepository);
  }

  async create(
    cookie: string,
    createMarkDto: CreateMarkDto,
    cardId: string,
  ): Promise<Mark> {
    try {
      const card = await this.cardService.findById(cardId);
      const user = await this.authService.user(cookie);
      const activeMark = await this.findActiveMark(card, user);

      if (activeMark) {
        //set to false active mark
        this.deactive(activeMark);
      }

      const mark = this.markRepository.create({ user, card, ...createMarkDto });
      // Logging.warn(activeMark);

      if (mark.value == 5) {
        //set card to finished
        this.cardService.setFinished(card, true);
      } else {
        this.cardService.setFinished(card, false);
      }

      // return mark;
      return this.markRepository.save(mark);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while creating a new note',
      );
    }
  }

  async deactive(mark: Mark) {
    try {
      this.markRepository.update(mark.id, { active: false });
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException('something went wrong while updating mark');
    }
  }

  async findActiveMark(card: Card, user: User): Promise<Mark> {
    try {
      return this.markRepository.findOneBy({
        card: { id: card.id },
        user: { id: user.id },
        active: true,
      });
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while finding active mark',
      );
    }
  }

  async updateActiveMarks(cardId: string) {
    await this.markRepository.update(
      { card: { id: cardId }, active: true },
      { active: false },
    );
  }
}

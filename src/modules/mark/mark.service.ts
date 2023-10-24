import { BadRequestException, Injectable } from '@nestjs/common';
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

      if (mark.value == 5) {
        this.cardService.setFinished(card);
      }

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
      const mark = await this.repository
        .createQueryBuilder('mark')
        .where('mark.cardId = :cardId', { cardId: card.id })
        .andWhere('mark.userId = :userId', { userId: user.id })
        .andWhere('mark.active = true')
        .getOne();

      return mark;
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'something went wrong while finding active mark',
      );
    }
  }
}

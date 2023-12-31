import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import Logging from 'src/library/Logging';
import { Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations = []): Promise<T[]> {
    try {
      return this.repository.find({ relations });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'something went wrong while searching for all',
      );
    }
  }

  async findBy(condition, relations = []): Promise<T> {
    try {
      return this.repository.findOne({
        where: condition,
        relations,
      });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'something went wrong while searching for one',
      );
    }
  }

  async findById(id: string, relations = []): Promise<T> {
    try {
      const element = await this.repository.findOne({
        where: { id },
        relations,
      });
      if (!element) {
        throw new BadRequestException(`Cannot find elemnt with id: ${id}`);
      }

      return element;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'something went wrong while searching for Id',
      );
    }
  }

  async remove(id: string): Promise<T> {
    const element = await this.findById(id);
    try {
      return this.repository.remove(element);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while deleting an element`,
      );
    }
  }
}

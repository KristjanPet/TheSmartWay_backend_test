import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { Note } from 'src/entities/note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateNoteDto } from './dto/create-note.dto';
import Logging from 'src/library/Logging';

@Injectable()
export class NoteService extends AbstractService<Note> {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    private readonly authService: AuthService,
  ) {
    super(noteRepository);
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

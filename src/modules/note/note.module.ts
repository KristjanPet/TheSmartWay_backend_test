import { Module, forwardRef } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/entities/note.entity';
import { UserModule } from '../user/user.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CardService } from '../card/card.service';
import { CardModule } from '../card/card.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    UserModule,
    forwardRef(() => CardModule),
  ],
  controllers: [NoteController],
  providers: [NoteService, AuthService, JwtService],
  exports: [NoteService],
})
export class NoteModule {}

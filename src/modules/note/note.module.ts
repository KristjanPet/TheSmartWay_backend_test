import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from 'src/entities/note.entity';
import { UserModule } from '../user/user.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), UserModule],
  controllers: [NoteController],
  providers: [NoteService, AuthService, JwtService],
  exports: [NoteService],
})
export class NoteModule {}

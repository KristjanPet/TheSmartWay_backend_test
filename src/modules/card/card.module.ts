import { Module, forwardRef } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from 'src/entities/card.entity';
import { NoteModule } from '../note/note.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { MarkModule } from '../mark/mark.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    UserModule,
    forwardRef(() => NoteModule),
    forwardRef(() => MarkModule),
  ],
  controllers: [CardController],
  providers: [CardService, AuthService, JwtService],
  exports: [CardService],
})
export class CardModule {}

import { Module, forwardRef } from '@nestjs/common';
import { MarkController } from './mark.controller';
import { MarkService } from './mark.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from 'src/entities/mark.entity';
import { UserModule } from '../user/user.module';
import { CardModule } from '../card/card.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mark]),
    UserModule,
    forwardRef(() => CardModule),
  ],
  controllers: [MarkController],
  providers: [MarkService, AuthService, JwtService],
  exports: [MarkService],
})
export class MarkModule {}

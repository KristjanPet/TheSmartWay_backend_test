import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from 'src/interfaces/JwtPayload.interface';
import Logging from 'src/library/Logging';
import { UserService } from 'src/modules/user/user.service';
import { compareHash, hash } from 'src/utils/bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    Logging.info('Validating user...');

    const user = await this.userService.findBy({ email: email });
    if (!user) {
      throw new BadRequestException('Invalida credentials');
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalida credentials');
    }

    Logging.info('User is valid.');
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.userService.findBy({
      email: registerUserDto.email,
    });
    if (user) {
      throw new BadRequestException('Email already used');
    }
    Logging.info(`Registrira uporanbika: ${registerUserDto.email}`);
    const hashedPassword: string = await hash(registerUserDto.password);
    return await this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
  }

  async generateJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, name: user.email });
  }

  async user(cookie: string): Promise<User> {
    const decoded: JwtPayload = this.jwtService.decode(cookie) as JwtPayload;
    // const decoded: any = this.jwtService.decode(cookie) as any;
    // console.log(decoded);

    return this.userService.findById(decoded.sub);
  }
}

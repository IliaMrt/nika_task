import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.model';
import { FullUserDto } from './dto/full.user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(dto: FullUserDto) {
    // проверяем, существует ли пользователь с таким мейлом. Если да -
    // пробрасываем ошибку.
    const candidateMail = await this.userService.getUserByEmail(dto.email);

    if (candidateMail) {
      throw new HttpException(
        'User with this email is already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // получаем хэш пароля, создаём пользователя и профиль
    const hashPassword = await bcrypt.hash(dto.password, 3);

    const user = await this.userService.createUser({
      email: dto.email,
      password: hashPassword,
    });

    // возвращаем токен в случае успешной регистрации
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);

    if (!user) {
      throw new UnauthorizedException({ message: 'Wrong email' });
    }

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );

    if (passwordEquals && user) {
      return user;
    }

    throw new UnauthorizedException({ message: 'Wrong password' });
  }
}

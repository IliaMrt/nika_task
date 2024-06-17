import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async edit(userDto: CreateUserDto, req) {
    console.log(JSON.stringify(userDto), JSON.stringify(req));
    // получаем из базы пользователя, на которого поступил запрос на редактирование
    const checkUser = await this.getUserByEmail(userDto.email);

    // получаем информацию из JWT токена о пользователе, направившем запрос
    const firstUserId = this.jwtService.verify(req.authorization.split(' ')[1]);

    // если пользователь, отправивший запрос редактрует не свой профиль
    // и не является администратором - отказываем в доступе
    if (!(firstUserId.email == userDto.email)) {
      throw new HttpException('You have no permission', HttpStatus.FORBIDDEN);
    }

    // если пользователя, которого надо отредактровать, не существует -
    // отказываем в доступе
    if (!checkUser) {
      throw new HttpException(
        'User with this email not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // применяем изменения к данным пользователя и профилю
    const hashPassword = await bcrypt.hash(userDto.password, 3);
    const user = await checkUser.update({
      email: userDto.email,
      password: hashPassword,
    });

    return user;
  }

  async delete(id: number, req) {
    // если не переданы данные авторизации - отказываем в доступе
    if (req.authorization == undefined) {
      throw new HttpException('You is not authorised', HttpStatus.FORBIDDEN);
    }

    // получаем информацию из JWT токена о пользователе, направившем запрос
    const firstUserId = this.jwtService.verify(req.authorization.split(' ')[1]);

    // если пользователь, отправивший запрос удаляет не свой профиль
    // и не является администратором - отказываем в доступе
    console.log(id);
    console.log(firstUserId);
    if (!(firstUserId.id == id)) {
      throw new HttpException('You have no permission', HttpStatus.FORBIDDEN);
    }

    // удаляем данные пользователя, профиль и данные из FileTable
    const user = await this.userRepository.destroy({ where: { id } });

    return user;
  }
}

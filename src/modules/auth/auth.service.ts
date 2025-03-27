import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { IRes } from 'src/common/models/res.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(user: CreateUserDto): Promise<IRes> {
    try {
      const userExist = await this.userService.getByEmail(user.email);

      if (userExist) {
        throw new BadRequestException('User already exist');
      }

      const passwordHashed = await bcrypt.hash(user.password, 10);

      const newUser = await this.userService.create({
        ...user,
        password: passwordHashed,
      });

      return {
        ok: true,
        status: HttpStatus.CREATED,
        message: 'User created',
        data: newUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(user: LoginDto): Promise<IRes> {
    try {
      const userExist = await this.userService.getByEmail(user.username);

      if (!userExist) {
        throw new BadRequestException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(
        user.password,
        userExist.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      return {
        ok: true,
        status: HttpStatus.OK,
        message: 'User logged in',
        data: userExist,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  logout() {}

  refreshToken() {}
}

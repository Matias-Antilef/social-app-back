import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { IRes, IResDelete } from 'src/common/models/res.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(createUserDto: CreateUserDto): Promise<IRes> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      const savedUser = await newUser.save();

      return {
        ok: true,
        status: HttpStatus.CREATED,
        message: 'User created',
        data: savedUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll() {
    return await this.userModel.find();
  }

  async getById(id: string) {
    return await this.userModel.findById(id);
  }
  async getByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IRes> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: id },
        updateUserDto,
        { new: true },
      );

      return {
        ok: true,
        status: HttpStatus.OK,
        message: 'User updated',
        data: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<IResDelete> {
    try {
      const deletedUser = await this.userModel.findOneAndDelete({ _id: id });

      if (!deletedUser) {
        throw new BadRequestException('User not found');
      }

      return {
        ok: true,
        status: HttpStatus.OK,
        message: 'User deleted',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

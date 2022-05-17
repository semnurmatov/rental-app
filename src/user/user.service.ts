import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';
import { FOLDERS } from 'src/image/cloudinary/constants';
import { ImageService } from 'src/image/image.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserDto, UpdateUserDto } from './dto';
import { UserFactory } from './user.factory';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userFactory: UserFactory,
    private readonly imageService: ImageService,
  ) {}

  async getUser(id: string): Promise<GetUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.userFactory.format(user);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const _data: Prisma.UserUpdateInput = new Object({});
    if (data.firstName) {
      Object.assign(_data, { firstName: data.firstName });
    }
    if (data.lastName) {
      Object.assign(_data, { lastName: data.lastName });
    }
    if (data.gender) {
      Object.assign(_data, { gender: data.gender });
    }
    if (data.birthDate) {
      Object.assign(_data, { birthDate: new Date(data.birthDate) });
    }
    if (data.avatar) {
      Object.assign(_data, { avatar: data.avatar });
    }
    if (data.phoneNumber) {
      Object.assign(_data, { phoneNumber: data.phoneNumber });
    }

    const updatedUser = await this.prisma.user.update({
      data: _data,
      where: { id },
    });

    if (!updatedUser) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }

    return this.userFactory.format(updatedUser);
  }

  async deleteUser(id: string): Promise<GetUserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.userFactory.format(user);
  }

  public async createUser(data: Prisma.UserCreateInput): Promise<GetUserDto> {
    try {
      //check if username(email) already exists
      const isExist = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (isExist) {
        throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
      }

      const user: User = await this.prisma.user.create({
        data,
      });

      return this.userFactory.format(user);
    } catch (err) {
      console.log(err);
    }
  }

  async updateUserRtHash(
    id: Prisma.UserWhereUniqueInput,
    rt: string | null,
  ): Promise<boolean> {
    const user: User = await this.prisma.user.findUnique({ where: id });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    if (!rt && !user.refreshToken) {
      throw new BadRequestException('Already signed out.');
    }

    const updatedUser = await this.prisma.user.update({
      data: { refreshToken: rt },
      where: id,
    });

    if (updatedUser) {
      return true;
    }

    return false;
  }

  async getUserWithToken(
    uniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: uniqueInput });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}

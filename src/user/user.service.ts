import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UploadApiResponse } from 'cloudinary';
import { FOLDERS } from 'src/file-system/cloudinary/constants';
import { FileSystemService } from 'src/file-system/file-system.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatDate } from 'src/utils/functions';
import { UserDto } from './dto';
import { UserFactory } from './user.factory';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userFactory: UserFactory,
    private readonly fileSystemService: FileSystemService,
  ) {}

  async getUser(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.userFactory.format(user);
  }

  async updateUser(data: UserDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id: data.id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const _data: Prisma.UserUpdateInput = new Object({});
    if (data.firstName && data.firstName !== user.firstName) {
      Object.assign(_data, { firstName: data.firstName });
    }
    if (data.lastName && data.lastName !== user.lastName) {
      Object.assign(_data, { lastName: data.lastName });
    }
    if (data.gender && data.gender !== user.gender) {
      Object.assign(_data, { gender: data.gender });
    }
    if (data.birthDate && data.birthDate !== formatDate(user.birthDate)) {
      Object.assign(_data, { birthDate: new Date(data.birthDate) });
    }
    if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
      Object.assign(_data, { phoneNumber: data.phoneNumber });
    }

    const updatedUser = await this.prisma.user.update({
      data: _data,
      where: { id: data.id },
    });

    if (!updatedUser) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }

    return this.userFactory.format(updatedUser);
  }

  async deleteUser(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return this.userFactory.format(user);
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserDto> {
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

  async uploadUserAvatar(id: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.avatar) {
      const publicId = await this.fileSystemService.getFilePublicId(
        user.avatar,
      );
      try {
        await this.fileSystemService.deleteFile(publicId);
      } catch (e) {
        console.log(e);
      }
    }
    const image = await this.fileSystemService.uploadFile(file, FOLDERS.USERS);

    const updatedUser = await this.prisma.user.update({
      data: { avatar: image.secure_url },
      where: { id },
    });

    return updatedUser.avatar;
  }

  // *** Helper functions ***
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

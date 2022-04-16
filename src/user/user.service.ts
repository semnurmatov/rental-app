import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from './constants';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dto';
import { UserFactory } from './user.factory';
import { User } from './user.model';
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: typeof User,
    private readonly userFactory: UserFactory,
  ) {}

  async getUser(userId: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.userFactory.format(user);
  }

  async updateUser(
    userId: string,
    body: Partial<UpdateUserDto>,
  ): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const _body = new Object({});
    if (body.firstName) {
      Object.assign(_body, { firstName: body.firstName });
    }
    if (body.lastName) {
      Object.assign(_body, { lastName: body.lastName });
    }
    if (body.gender) {
      Object.assign(_body, { gender: body.gender });
    }
    if (body.birthDate) {
      Object.assign(_body, { birthDate: body.birthDate });
    }
    if (body.avatar) {
      Object.assign(_body, { avatar: body.avatar });
    }
    if (body.lattitude || body.longitude) {
      Object.assign(_body, {
        lattitude: body.lattitude,
        longitude: body.longitude,
      });
    }
    const update = await this.userRepository.update(_body, {
      where: { userId },
    });

    const updatedUser = await this.userRepository.findOne({
      where: { userId },
    });

    if (update[0] < 1 || !updatedUser) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
    return this.userFactory.format(updatedUser);
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const deleteUser = await this.userRepository.destroy({ where: { userId } });

    if (deleteUser > 0) {
      return true;
    }

    return false;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  public async createUser(body: CreateUserDto): Promise<Partial<User>> {
    try {
      //check if username(email) already exists
      const isExist = await this.userRepository.findOne({
        where: { email: body.email },
      });

      if (isExist) {
        throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
      }

      const user: User = await this.userRepository.create({
        userId: body.userId,
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
        gender: body.gender,
        birthDate: body.birthDate,
        avatar: body.avatar,
        lattitude: body.lattitude,
        longitude: body.longitude,
      });

      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async updateRtHash(userId: string, rt: string | null): Promise<boolean> {
    const user: User = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    if (!rt && !user.refreshToken) {
      throw new BadRequestException('Already signed out.');
    }

    const updatedUser = await this.userRepository.update(
      { refreshToken: rt },
      { where: { userId } },
    );

    if (updatedUser[0] > 0) {
      return true;
    }

    return false;
  }
}

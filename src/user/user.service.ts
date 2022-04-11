import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { SignupDto } from 'src/auth/dto';
import { User } from './user.model';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userModel: typeof User,
  ) {}

  // async createUser(createUser: UserType): Promise<User> {
  //   return this.userModel.create({ firstName: 'SEM', lastName: 'Nur' });
  // }

  // async findAll(): Promise<User[]> {
  //   return this.userModel.findAll();
  // }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.userModel.findOne({ where: { userId } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async createUser(body: SignupDto): Promise<Partial<User>> {
    try {
      //check if username(email) already exists
      const isExist = await this.userModel.findOne({
        where: { email: body.email },
      });

      if (isExist) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const user: User = await this.userModel.create({
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

  async updateRtHash(userId: number, rt: string | null): Promise<boolean> {
    const user: User = await this.userModel.findOne({ where: { userId } });

    if (!rt && !user.refreshToken) {
      throw new BadRequestException('Already signed out.');
    }

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.userModel.update(
      { refreshToken: rt },
      { where: { userId } },
    );

    if (updatedUser[0] > 0) {
      return true;
    }

    return false;
  }
}

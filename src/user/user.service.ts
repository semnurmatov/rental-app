import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SignupDto } from 'src/auth/dto';
import { User } from './user.model';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // async createUser(createUser: UserType): Promise<User> {
  //   return this.userModel.create({ firstName: 'SEM', lastName: 'Nur' });
  // }

  // async findAll(): Promise<User[]> {
  //   return this.userModel.findAll();
  // }

  // async findByLogin(user: MockUserType): Promise<MockUserType | undefined> {
  //   const _user = users.find((element) => element.username === user.username);
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
  //   }
  //   const passwordCheck =
  //   return;
  // }

  public async createUser(body: SignupDto): Promise<Partial<User>> {
    try {
      //check if username(email) already exists
      const isExist = await this.userModel.findOne({ where: { email: body.email } });
      console.log('ISEXIST', isExist);

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

  async updateRtHash(userId: number, rt: string): Promise<boolean> {
    const user = this.userModel.findOne({ where: { userId } });

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

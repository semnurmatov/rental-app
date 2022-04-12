import { GetUserDto } from './types';
import { User } from './user.model';

export class UserFactory {
  async format(user: User): Promise<GetUserDto> {
    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      birthDate: user.birthDate,
      avatar: user.avatar,
      lattitude: user.lattitude,
      longitude: user.longitude,
    };
  }
}

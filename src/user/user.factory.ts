import { User } from '@prisma/client';
import { formatDate } from '../utils/functions';
import { UserDto } from './dto';

export class UserFactory {
  async format(user: User): Promise<UserDto> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      birthDate: formatDate(user.birthDate),
      avatar: user.avatar,
    };
  }
}

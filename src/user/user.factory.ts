import { User } from '@prisma/client';
import { formatDate } from 'src/utils/functions';
import { GetUserDto } from './dto';

export class UserFactory {
  async format(user: User): Promise<GetUserDto> {
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

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

  async getFilePublicId(url: string): Promise<string> {
    let publicId: string;
    if (url.includes('users')) {
      publicId = 'users/' + url.split('users/')[1].split('.')[0];
    }
    return publicId;
  }
}

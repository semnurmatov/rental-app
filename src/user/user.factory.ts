import { User } from '@prisma/client';
import { GetUserDto } from './dto';

export class UserFactory {
  async format(user: User): Promise<GetUserDto> {
    // const date = user.birthDate.toLocaleDateString(); ????

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      birthDate: user.birthDate?.toLocaleDateString(),
      avatar: user.avatar,
    };
  }
}

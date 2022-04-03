import { Injectable } from '@nestjs/common';
import { UserRegister } from './types/UserRegister';

@Injectable()
export class UserService {
  public async register(
    username: string,
    password: string,
  ): Promise<UserRegister> {
    return {
      userId: 'test-id',
      token: { token_type: 'Bearer', access_token: 'some-token' },
    };
  }
}

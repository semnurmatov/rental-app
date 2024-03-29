import { UserDto } from '../../user/dto';
import { Tokens } from './tokens.type';

export interface SignInResponse {
  tokens: Tokens;
  user: UserDto;
}

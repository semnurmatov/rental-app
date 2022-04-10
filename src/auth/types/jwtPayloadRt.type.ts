import { JwtPayload } from './jwtPayload.type';

export type JwtPayloadRt = JwtPayload & {
  refreshToken: string;
};

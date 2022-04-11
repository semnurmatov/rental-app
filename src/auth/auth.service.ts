import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtPayload, Tokens } from './types';
import * as argon from 'argon2';
import { AuthDto, SignupDto } from './dto';
import { User } from 'src/user/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async signupLocal(body: SignupDto): Promise<Tokens> {
    const hash = await argon.hash(body.password);
    body.password = hash;
    const user = await this.userService.createUser(body);

    const tokens: Tokens = await this.getTokens(user.userId, user.email);
    await this.updateRtHash(user.userId, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  public async singinLocal(body: AuthDto): Promise<Tokens> {
    const user = await this.userService.findUserByEmail(body.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const passwordMatches = await argon.verify(user.password, body.password);

    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.userId, user.email);

    await this.updateRtHash(user.userId, tokens.refresh_token);

    return tokens;
  }

  public async signout(userId: number): Promise<boolean> {
    return this.userService.updateRtHash(userId, null);
  }

  private async updateRtHash(userId: number, rt: string): Promise<boolean> {
    const hash = await argon.hash(rt);

    const isUpdated = await this.userService.updateRtHash(userId, hash);

    if (isUpdated) {
      return true;
    }
    return false;
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: '15m',
      }),

      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, SignInResponse, Tokens } from './types';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { UserService } from '../user/user.service';
import { UserFactory } from '../user/user.factory';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userFactory: UserFactory,
    private jwtService: JwtService,
  ) {}

  public async signup(body: CreateUserDto): Promise<SignInResponse> {
    const { id, ..._body } = body;

    const hash = await argon.hash(body.password);
    Object.assign(_body, { password: hash });
    Object.assign(_body, { birthDate: new Date(body.birthDate) });

    const user = await this.userService.createUser(
      _body as Prisma.UserCreateInput,
    );
    if (!user) {
      throw new HttpException('Current email is already exist.', HttpStatus.OK);
    }

    const tokens: Tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      name: user.firstName,
    });

    await this.updateRtHash({ id: user.id }, tokens.refresh_token);

    return { tokens, user };
  }

  public async signin(body: AuthDto): Promise<SignInResponse> {
    const user = await this.userService.getUserWithToken({ email: body.email });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    let passwordMatches;
    try {
      passwordMatches = await argon.verify(user.password, body.password);
    } catch (err) {
      console.log(err);
    }

    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      name: user.firstName,
    });

    await this.updateRtHash({ id: user.id }, tokens.refresh_token);
    const formattedUser = await this.userFactory.format(user);

    return { tokens, user: formattedUser };
  }

  public async signout(id: string): Promise<boolean> {
    return this.userService.updateUserRtHash({ id }, null);
  }

  private async updateRtHash(
    id: Prisma.UserWhereUniqueInput,
    rt: string,
  ): Promise<boolean> {
    const hash = await argon.hash(rt);

    const isUpdated = await this.userService.updateUserRtHash(id, hash);

    if (isUpdated) {
      return true;
    }
    return false;
  }

  public async refreshTokens(
    id: Prisma.UserWhereUniqueInput,
    rt: string,
  ): Promise<Tokens> {
    const user = await this.userService.getUserWithToken(id);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await argon.verify(user.refreshToken, rt);
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
      name: user.firstName,
    });
    const updateRt = await this.updateRtHash(
      { id: user.id },
      tokens.refresh_token,
    );

    if (!updateRt) {
      throw new HttpException('Something went wrong.', HttpStatus.BAD_REQUEST);
    }
    return tokens;
  }

  private async getTokens(payload: JwtPayload): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.AT_SECRET,
        expiresIn: '12h',
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.RT_SECRET,
        expiresIn: '15d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}

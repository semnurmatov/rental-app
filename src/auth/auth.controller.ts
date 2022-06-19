import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/user/dto';
import { Public } from '../common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { RtGuard } from './guards';
import { SignInResponse } from './types';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  public async signup(@Body() body: CreateUserDto): Promise<SignInResponse> {
    return this.authService.signup(body);
  }

  @Public()
  @Post('/signin')
  public async singin(@Body() body: AuthDto): Promise<SignInResponse> {
    return this.authService.signin(body);
  }

  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  public async signout(@Req() req: Request) {
    const user = req.user;
    return this.authService.signout(user['sub']);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh-tokens')
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshTokens(
      { id: user['sub'] },
      user['refreshToken'],
    );
  }
}

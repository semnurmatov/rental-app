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
import { Public } from '../common';
import { AuthService } from './auth.service';
import { AuthDto, SignupDto } from './dto';
import { RtGuard } from './guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  public async signupLocal(@Body() body: SignupDto): Promise<Tokens> {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  public async singinLocal(@Body() body: AuthDto): Promise<Tokens> {
    return this.authService.singin(body);
  }

  @Post('signout')
  public async signout(@Req() req: Request) {
    const user = req.user;
    return this.authService.signout(user['sub']);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(@Req() req: Request) {
    const user = req.user;
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }
}

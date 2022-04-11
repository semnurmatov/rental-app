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
import { AuthService } from './auth.service';
import { AuthDto, SignupDto } from './dto';
import { AtGuard, RtGuard } from './guards';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  public async signupLocal(@Body() body: SignupDto): Promise<Tokens> {
    return this.authService.signupLocal(body);
  }

  @Post('local/signin')
  public async singinLocal(@Body() body: AuthDto): Promise<Tokens> {
    return this.authService.singinLocal(body);
  }

  @UseGuards(AtGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  public async signout(@Req() req: Request) {
    const user = req.user;
    return this.authService.signout(user['sub']);
  }

  @UseGuards(RtGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Req() req: Request) {
    return;
  }
}

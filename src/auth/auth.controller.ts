import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  async signupLocal(@Body() body: SignupDto): Promise<Tokens> {
    return this.authService.signupLocal(body);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req): Promise<any> {
  //   return this.authService.login(req.user);
  // }
}

import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/auth/signup.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response } from '../common/utils/response.util';
import { DefaultMessages } from '../common/constants/message.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const user = await this.authService.signup(dto);
    return Response.success(DefaultMessages.AUTH.SIGNUP_SUCCESS, user);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const token = await this.authService.login(dto);
    return Response.success(DefaultMessages.AUTH.LOGIN_SUCCESS, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const profile = await this.authService.getProfile(req.user.userId);
    return Response.success(DefaultMessages.COMMON.OK, profile);
  }
}



import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  register(@Body() dto: RegisterDto) {
    const { username, password } = dto
    return this.authService.register({ username, password });
  }

  @Post('signin')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('signin-admin')
  adminLogin(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto);
  }
}

import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus, } from '@nestjs/common';
//import { Public } from '@prisma/client/runtime/library';
import { AuthService } from './auth.service';
import { LoginRequestBody } from './dto/loginRequestBody.dto';
import { Public } from './Decorators/isPublic.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() LoginRequestBody :LoginRequestBody) {
    return this.authService.login(LoginRequestBody);
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}

import { Controller, Get, Post, Body, Request, HttpCode, HttpStatus, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestBody } from './dto/loginRequestBody.dto';
import { Public } from './Decorators/isPublic.decorator';
import { UsuarioService } from 'src/usuario/usuario.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService 
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() LoginRequestBody :LoginRequestBody) {
    return this.authService.login(LoginRequestBody);
  }

  @Get('me')
  async getProfile(@Request() req) {
    // req.user.sub é o id do usuário
    const user = await this.usuarioService.findMe(req.user.sub);
    
    if (user) return user;

    return null;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { LoginRequestBody } from './dto/loginRequestBody.dto';
import * as bcrypt from 'bcrypt';
import { UsuarioPayload } from './type/UsuarioPayload';
import { UsuarioToken } from './type/UsuarioToken';
import { Role } from '@prisma/client'; 
@Injectable()
export class AuthService {
  constructor(private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}

  async login(LoginRequestBody: LoginRequestBody): Promise<UsuarioToken> {

    const user = await this.validateUser(LoginRequestBody.email, LoginRequestBody.senha);

    if (!user){
      throw new UnauthorizedException('Credenciais inválidas')
    }

    const payload : UsuarioPayload = { 
      email: user.email, 
      sub: user.id,
      role: user.role, // Adicionando o campo role ao payload 
    };
    
    const jwtToken = this.jwtService.sign(payload, { expiresIn: '1d', secret: this.configService.get('JWT_SECRET')});

    return {
      access_token: jwtToken
    }

  }


  async validateUser(email: string, senha: string){
    const user = await this.usuarioService.findByEmail(email);
    
    if (user) {
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (isPasswordValid){
        return { 
          ...user,
          senha:undefined,};
      }
    }

    return null
  }
}

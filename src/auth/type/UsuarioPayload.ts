export class UsuarioPayload {
    sub: number;
    email: string;
    iat?: number; //para saber quando o token foi criado
    exp?: number; //para decidir data de expiração do token
}
import{ IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class LoginRequestBody {
    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    senha:string;
}
import {IsEmail, IsOptional, IsString, MinLength, IsNotEmpty, Min, Validate} from 'class-validator';
import { PartialType} from '@nestjs/mapped-types';
import { Usuario } from '../entities/usuario.entity';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

function Match(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'match',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `O campo ${args.property} deve coincidir com o campo ${relatedPropertyName}.`;
                }
            },
        });
    };
}

export class UpdateUsuarioDto extends PartialType(Usuario) {   //documentando o partialtype que torna todos os campos opcionais, para garantir. 
    @IsOptional()
    @IsEmail({}, { message: 'O email fornecido é inválido.' })
    email?: string;

    @IsOptional()
    @IsString()
    nome?:string;

    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
    @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
    senha?: string;
    
    @IsOptional()
    @IsString()
    departamento?: string;

    @IsOptional()
    @IsString()
    curso?: string;

    @IsOptional()
    fotoPerfil?: Buffer; 

    @IsOptional()
    @IsString()
    novaSenha?: string;

    @IsOptional()
    @IsString()
    @Match('novaSenha', { message: 'A confirmação da senha não coincide com a nova senha.' })
    confirmarSenha?: string;
}

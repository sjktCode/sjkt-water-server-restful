import { IsNotEmpty } from 'class-validator';

/**
 * 登录DTO
 */
export class LoginDto {
    @IsNotEmpty({ message: '手机号必须填写' })
    tel: string;

    @IsNotEmpty({ message: '验证码必须填写' })
    code: string;
}

/**
 * 学生登录DTO
 */
export class StudentLoginDto {
    @IsNotEmpty({ message: '学生账号必须填写' })
    account: string;

    @IsNotEmpty({ message: '验证码必须填写' })
    password: string;
}

/**
 * 学生注册DTO
 */
export class RegisterDto {
    @IsNotEmpty({ message: '用户账号必须填写' })
    account: string;

    @IsNotEmpty({ message: '验证码必须填写' })
    password: string;
}

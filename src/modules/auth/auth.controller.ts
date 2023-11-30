import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, StudentLoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get(':tel')
    async sendCodeMsg(@Param('tel') tel: string) {
        return this.authService.sendCodeMsg(tel);
    }

    @Post('login')
    async login(@Body() data: LoginDto) {
        return this.authService.login(data.tel, data.code);
    }

    @Post('studentLogin')
    async studentLogin(@Body() data: StudentLoginDto) {
        return this.authService.studentLogin(data.account, data.password);
    }

    @Post('register')
    async studentRegister(@Body() data: StudentLoginDto) {
        return this.authService.studentRegister(data.account, data.password);
    }
}

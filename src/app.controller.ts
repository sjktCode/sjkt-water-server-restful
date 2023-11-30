import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { UserEntity } from './modules/user/models/user.entity';
import { UserService } from './modules/user/user.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly userService: UserService,
    ) {}

    @Get('/create')
    async create(id: string) {
        return this.userService.create({
            name: '水滴超级管理员',
            desc: '管理员',
            tel: '8800888',
        });
    }

    @Get('/del')
    async del() {
        return this.userService.delete('f5412fa7-0e09-444e-9825-484da5e814f5');
    }

    @Get('/update')
    async update() {
        this.userService.update({
            id: 'd9ea8b6f-706c-48fb-98ee-0a46e1f4636e',
            name: '水滴超级管理员11111',
        });
    }

    @Get('/find')
    async find(): Promise<UserEntity> {
        return this.userService.detail('d9ea8b6f-706c-48fb-98ee-0a46e1f4636e');
    }

    @Get('/getHello')
    async getHello(): Promise<string> {
        return this.appService.getHello();
    }
}

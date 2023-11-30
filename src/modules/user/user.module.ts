import { ConsoleLogger, DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './models/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({})
export class UserModule {
    static forRoot(): DynamicModule {
        return {
            module: UserModule,
            imports: [TypeOrmModule.forFeature([UserEntity])],
            controllers: [UserController],
            providers: [ConsoleLogger, UserService],
            exports: [UserService],
        };
    }
}

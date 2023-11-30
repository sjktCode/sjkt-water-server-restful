import { ConsoleLogger, DynamicModule, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Student } from '../student/models/student.entity';
import { StudentService } from '../student/student.service';
import { UserEntity } from '../user/models/user.entity';
import { UserService } from '../user/user.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthModule {
    static forRoot(): DynamicModule {
        return {
            module: AuthModule,
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: `${60 * 60 * 24 * 7}s`,
                    },
                }),
                TypeOrmModule.forFeature([UserEntity, Student]),
            ],
            controllers: [AuthController],
            providers: [JwtStrategy, ConsoleLogger, AuthService, UserService, StudentService],
            exports: [],
        };
    }
}

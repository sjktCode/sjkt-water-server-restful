import { ConsoleLogger, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Student } from '../student/models/student.entity';
import { StudentService } from '../student/student.service';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: `${60 * 60 * 24 * 7}s`,
            },
        }),
        TypeOrmModule.forFeature([User, Student]),
    ],
    providers: [JwtStrategy, ConsoleLogger, AuthService, AuthResolver, UserService, StudentService],
    exports: [],
})
export class AuthModule {}

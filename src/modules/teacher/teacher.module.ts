import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Teacher } from './models/teacher.entity';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';

@Module({
    imports: [TypeOrmModule.forFeature([Teacher])],
    providers: [TeacherService, TeacherResolver],
    exports: [TeacherService],
})
export class TeacherModule {}

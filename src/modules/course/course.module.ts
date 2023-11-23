import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourseResolver } from './course.resolver';

import { CourseService } from './course.service';
import { Course } from './models/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course])],
    providers: [CourseService, CourseResolver],
    exports: [CourseService],
})
export class CourseModule {}

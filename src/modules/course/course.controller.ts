import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { FindOptionsWhere, Like } from 'typeorm';

import { SUCCESS } from '@/common/constants/code';

import { CurOrgId } from '@/common/decorators/current-org.decorator';
import { CurUserId } from '@/common/decorators/current-user.decorator';

import { JwtAuthGuard } from '@/common/guards/auth.guards';

import { CourseService } from './course.service';
import { QueryCourseDto } from './dto/course.dto';
import { CourseType } from './dto/course.type';
import { Course } from './models/course.entity';

@Resolver(() => CourseType)
@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Get()
    async getCourses(
        @Query()
        options: QueryCourseDto,
        @CurUserId() userId: string,
        @CurOrgId() orgId: string,
    ) {
        const { page, limit, name } = options;
        const where: FindOptionsWhere<Course> = {
            createdBy: userId,
            organization: {
                id: orgId,
            },
        };
        if (name) {
            where.name = Like(`%${name}%`);
        }
        const [results, total] = await this.courseService.findCourses({
            start: (page - 1) * limit,
            length: limit,
            where,
        });
        return {
            code: SUCCESS,
            data: results,
            page: {
                page,
                limit,
                total,
            },
            message: '获取成功',
        };
    }
}

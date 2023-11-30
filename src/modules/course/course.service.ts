import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { Course } from './models/course.entity';
import { CourseRepository } from './repositories/course.repository';

@Injectable()
export class CourseService {
    constructor(private readonly courseRepository: CourseRepository) {}

    async create(entity: DeepPartial<Course>): Promise<boolean> {
        const res = await this.courseRepository.save(this.courseRepository.create(entity));
        if (res) {
            return true;
        }
        return false;
    }

    async findById(id: string): Promise<Course> {
        return this.courseRepository.findOne({
            where: {
                id,
            },
            relations: ['teachers'],
        });
    }

    async updateById(id: string, entity: DeepPartial<Course>): Promise<boolean> {
        const existEntity = await this.findById(id);
        if (!existEntity) {
            return false;
        }
        Object.assign(existEntity, entity);
        const res = await this.courseRepository.save(existEntity);
        if (res) {
            return true;
        }
        return false;
    }

    async findCourses({
        start,
        length,
        where,
    }: {
        start: number;
        length: number;
        where: FindOptionsWhere<Course>;
    }): Promise<[Course[], number]> {
        return this.courseRepository.findAndCount({
            take: length,
            skip: start,
            where,
            order: {
                createdAt: 'DESC',
            },
            relations: ['organization', 'teachers'],
        });
    }

    async deleteById(id: string, userId: string): Promise<boolean> {
        const res1 = await this.courseRepository.update(id, {
            deletedBy: userId,
        });
        if (res1) {
            const res = await this.courseRepository.softDelete(id);
            if (res.affected > 0) {
                return true;
            }
        }
        return false;
    }
}

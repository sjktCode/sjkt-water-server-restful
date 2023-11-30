import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { Course } from '../models/course.entity';

@CustomRepository(Course)
export class CourseRepository extends Repository<Course> {}

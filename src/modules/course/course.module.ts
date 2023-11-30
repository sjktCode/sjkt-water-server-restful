import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../database/database.module';

import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './models/course.entity';
import { CourseRepository } from './repositories/course.repository';

@Module({})
export class CourseModule {
    static forRoot(): DynamicModule {
        const providers: ModuleMetadata['providers'] = [
            {
                provide: CourseService,
                inject: [CourseRepository],
                useFactory(courseRepository: CourseRepository) {
                    return new CourseService(courseRepository);
                },
            },
        ];
        return {
            module: CourseModule,
            imports: [
                TypeOrmModule.forFeature([Course]),
                DatabaseModule.forRepository([CourseRepository]),
            ],
            controllers: [CourseController],
            providers,
            exports: [CourseService, DatabaseModule.forRepository([CourseRepository])],
        };
    }
}

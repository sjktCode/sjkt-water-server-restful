import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardRecordModule } from '../cardrecord/card-record.module';
import { CourseModule } from '../course/course.module';

import { ScheduleRecordModule } from '../schedule-record/schedule-record.module';

import { Schedule } from './models/schedule.entity';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Schedule]),
        CourseModule,
        CardRecordModule,
        ScheduleRecordModule,
    ],
    providers: [ScheduleService, ScheduleResolver],
    exports: [ScheduleService],
})
export class ScheduleModule {}

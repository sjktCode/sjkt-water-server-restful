import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardRecordModule } from '../cardrecord/card-record.module';

import { ScheduleRecord } from './models/schedule-record.entity';
import { ScheduleRecordResolver } from './schedule-record.resolver';
import { ScheduleRecordService } from './schedule-record.service';

@Module({
    imports: [TypeOrmModule.forFeature([ScheduleRecord]), CardRecordModule],
    providers: [ScheduleRecordService, ScheduleRecordResolver],
    exports: [ScheduleRecordService],
})
export class ScheduleRecordModule {}

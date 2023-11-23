import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardModule } from '../card/card.module';
import { StudentModule } from '../student/student.module';

import { CardRecordResolver } from './card-record.resolver';
import { CardRecordService } from './card-record.service';
import { CardRecord } from './models/card-record.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CardRecord]), CardModule, StudentModule],
    providers: [CardRecordService, CardRecordResolver],
    exports: [CardRecordService],
})
export class CardRecordModule {}

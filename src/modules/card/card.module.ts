import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardResolver } from './card.resolver';

import { CardService } from './card.service';
import { Card } from './models/card.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Card])],
    providers: [CardService, CardResolver],
    exports: [CardService],
})
export class CardModule {}

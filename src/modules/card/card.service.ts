import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, FindOptionsWhere } from 'typeorm';

import { Card } from './models/card.entity';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>,
    ) {}

    async create(entity: DeepPartial<Card>): Promise<boolean> {
        const res = await this.cardRepository.save(this.cardRepository.create(entity));
        if (res) {
            return true;
        }
        return false;
    }

    async findById(id: string): Promise<Card> {
        return this.cardRepository.findOne({
            where: {
                id,
            },
            relations: ['course', 'organization'],
        });
    }

    async updateById(id: string, entity: DeepPartial<Card>): Promise<boolean> {
        const existEntity = await this.findById(id);
        if (!existEntity) {
            return false;
        }
        Object.assign(existEntity, entity);
        const res = await this.cardRepository.save(existEntity);
        if (res) {
            return true;
        }
        return false;
    }

    async findCards({ where }: { where: FindOptionsWhere<Card> }): Promise<[Card[], number]> {
        return this.cardRepository.findAndCount({
            where,
            order: {
                createdAt: 'DESC',
            },
            relations: ['course'],
        });
    }

    async deleteById(id: string, userId: string): Promise<boolean> {
        const res1 = await this.cardRepository.update(id, {
            deletedBy: userId,
        });
        if (res1) {
            const res = await this.cardRepository.softDelete(id);
            if (res.affected > 0) {
                return true;
            }
        }
        return false;
    }
}

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FindOptionsWhere, Like } from 'typeorm';

import { SUCCESS } from '@/common/constants/code';

import { CurOrgId } from '@/common/decorators/current-org.decorator';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { Result } from '@/common/dto/result.type';
import { JwtAuthGuard } from '@/common/guards/auth.guards';

import {
    CARD_CREATE_FAIL,
    CARD_DEL_FAIL,
    CARD_NOT_EXIST,
    CARD_UPDATE_FAIL,
} from '../../common/constants/code';

import { CardService } from './card.service';
import { CardInput } from './dto/card.input';
import { CardType } from './dto/card.type';
import { CardResult, CardResults } from './dto/result-card.output';
import { Card } from './models/card.entity';

@Resolver(() => CardType)
@UseGuards(JwtAuthGuard)
export class CardResolver {
    constructor(private readonly cardService: CardService) {}

    @Query(() => CardResult)
    async getCardInfo(@Args('id') id: string): Promise<CardResult> {
        const result = await this.cardService.findById(id);
        if (result) {
            return {
                code: SUCCESS,
                data: result,
                message: '获取成功',
            };
        }
        return {
            code: CARD_NOT_EXIST,
            message: '课程信息不存在',
        };
    }

    @Mutation(() => CardResult)
    async commitCardInfo(
        @Args('params') params: CardInput,
        @Args('courseId') courseId: string,
        @CurUserId() userId: string,
        @CurOrgId() orgId: string,
        @Args('id', { nullable: true }) id: string,
    ): Promise<Result> {
        if (!id) {
            const res = await this.cardService.create({
                ...params,
                organization: {
                    id: orgId,
                },
                course: {
                    id: courseId,
                },
                createdBy: userId,
            });
            if (res) {
                return {
                    code: SUCCESS,
                    message: '创建成功',
                };
            }
            return {
                code: CARD_CREATE_FAIL,
                message: '创建失败',
            };
        }
        const card = await this.cardService.findById(id);
        if (card) {
            const res = await this.cardService.updateById(card.id, {
                ...params,
                updatedBy: userId,
            });
            if (res) {
                return {
                    code: SUCCESS,
                    message: '更新成功',
                };
            }
            return {
                code: CARD_UPDATE_FAIL,
                message: '更新失败',
            };
        }
        return {
            code: CARD_NOT_EXIST,
            message: '消费卡信息不存在',
        };
    }

    @Query(() => CardResults)
    async getCards(
        @Args('courseId') courseId: string,
        @CurUserId() userId: string,
        @Args('name', { nullable: true }) name?: string,
    ): Promise<CardResults> {
        const where: FindOptionsWhere<Card> = {
            createdBy: userId,
            course: {
                id: courseId,
            },
        };
        if (name) {
            where.name = Like(`%${name}%`);
        }
        const [results] = await this.cardService.findCards({
            where,
        });
        return {
            code: SUCCESS,
            data: results,
            message: '获取成功',
        };
    }

    @Mutation(() => Result)
    async deleteCard(@Args('id') id: string, @CurUserId() userId: string): Promise<Result> {
        const result = await this.cardService.findById(id);
        if (result) {
            const delRes = await this.cardService.deleteById(id, userId);
            if (delRes) {
                return {
                    code: SUCCESS,
                    message: '删除成功',
                };
            }
            return {
                code: CARD_DEL_FAIL,
                message: '删除失败',
            };
        }
        return {
            code: CARD_NOT_EXIST,
            message: '门店信息不存在',
        };
    }
}

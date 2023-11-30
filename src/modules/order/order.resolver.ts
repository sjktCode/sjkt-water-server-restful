import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FindOptionsWhere } from 'typeorm';

import { SUCCESS } from '@/common/constants/code';

import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { Result } from '@/common/dto/result.type';
import { JwtAuthGuard } from '@/common/guards/auth.guards';

import { COURSE_DEL_FAIL, COURSE_NOT_EXIST } from '../../common/constants/code';

import { OrderType } from './dto/order.type';
import { OrderResult, OrderResults } from './dto/result-order.output';
import { Order } from './models/order.entity';
import { OrderService } from './order.service';

@Resolver(() => OrderType)
@UseGuards(JwtAuthGuard)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Query(() => OrderResult)
    async getOrderInfo(@Args('id') id: string): Promise<OrderResult> {
        const result = await this.orderService.findById(id);
        if (result) {
            return {
                code: SUCCESS,
                data: result,
                message: '获取成功',
            };
        }
        return {
            code: COURSE_NOT_EXIST,
            message: '订单信息不存在',
        };
    }

    @Query(() => OrderResults)
    async getOrders(
        @Args('page') page: PageInput,
        @CurUserId() userId: string,
    ): Promise<OrderResults> {
        const { pageNum, pageSize } = page;
        const where: FindOptionsWhere<Order> = { createdBy: userId };
        const [results, total] = await this.orderService.findOrders({
            start: (pageNum - 1) * pageSize,
            length: pageSize,
            where,
        });
        return {
            code: SUCCESS,
            data: results,
            page: {
                pageNum,
                pageSize,
                total,
            },
            message: '获取成功',
        };
    }

    @Mutation(() => Result)
    async deleteOrder(@Args('id') id: string, @CurUserId() userId: string): Promise<Result> {
        const result = await this.orderService.findById(id);
        if (result) {
            const delRes = await this.orderService.deleteById(id, userId);
            if (delRes) {
                return {
                    code: SUCCESS,
                    message: '删除成功',
                };
            }
            return {
                code: COURSE_DEL_FAIL,
                message: '删除失败',
            };
        }
        return {
            code: COURSE_NOT_EXIST,
            message: '门店信息不存在',
        };
    }
}

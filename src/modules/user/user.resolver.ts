import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SUCCESS, UPDATE_ERROR } from '@/common/constants/code';
import { Result } from '@/common/dto/result.type';
import { GqlAuthGuard } from '@/common/guards/auth.guards';

import { UserInput } from './dto/user-input.type';
import { UserType } from './dto/user.type';
import { UserService } from './user.service';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => Boolean, { description: '新增用户' })
    async create(@Args('params') params: UserInput): Promise<boolean> {
        return this.userService.create(params);
    }

    @Query(() => UserType, { description: '使用 ID 查询用户' })
    async find(@Args('id') id: string): Promise<UserType> {
        return this.userService.find(id);
    }

    @Query(() => UserType, { description: '使用 ID 查询用户' })
    async getUserInfo(@Context() cxt: any): Promise<UserType> {
        const { id } = cxt.req.user;
        return this.userService.find(id);
    }

    @Mutation(() => Result, { description: '更新用户' })
    async updateUserInfo(
        @Args('id') id: string,
        @Args('params') params: UserInput,
    ): Promise<Result> {
        const res = await this.userService.update(id, params);
        if (res) {
            return {
                code: SUCCESS,
                message: '更新成功',
            };
        }
        return {
            code: UPDATE_ERROR,
            message: '更新失败',
        };
    }

    @Mutation(() => Boolean, { description: '删除一个用户' })
    async del(@Args('id') id: string): Promise<boolean> {
        return this.userService.del(id);
    }
}

import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';
import { SelectTrashMode } from '@/modules/database/constants';

import { PaginateOptions } from '@/modules/database/types';

import { UserOrderType } from '../constants';

/**
 * 创建用的请求数据验证
 */
@DtoValidation({ groups: ['create'] })
export class CreateUserDto {
    @MaxLength(255, {
        always: true,
        message: '昵称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '昵称必须填写' })
    @IsOptional({ groups: ['update'] })
    name?: string;

    @IsOptional({ always: true })
    desc?: string;

    @IsOptional({ always: true })
    avatar?: string;

    /**
     * 手机号
     */
    tel?: string;

    /**
     * 验证码
     */
    code?: string;

    /**
     * 验证码生成时间
     */
    codeCreateTimeAt?: Date;
}

/**
 * 更新用户
 */
@DtoValidation({ groups: ['update'] })
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsUUID(undefined, { groups: ['update'], message: '用户ID格式不正确' })
    @IsDefined({ groups: ['update'], message: '用户ID必须指定' })
    id!: string;
}

/**
 * 查询用户列表的Query数据验证
 */
@DtoValidation({ type: 'query' })
export class QueryUserDto implements PaginateOptions {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;

    @IsEnum(UserOrderType)
    orderBy?: UserOrderType;
}

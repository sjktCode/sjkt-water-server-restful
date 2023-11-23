import { Field, ObjectType } from '@nestjs/graphql';

import { CommonType } from '@/common/dto/common.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { ProductType } from '@/modules/product/dto/product.type';
import { StudentType } from '@/modules/student/dto/student.type';

/**
 * 订单
 */
@ObjectType()
export class OrderType extends CommonType {
    @Field({ nullable: true })
    declare id: string;

    @Field({
        description: '数量',
    })
    quantity: number;

    @Field({
        description: 'amount',
    })
    amount: number;

    @Field({
        description: '手机号',
    })
    tel: string;

    @Field({
        description: '状态',
    })
    status: string;

    @Field({
        description: 'createdAt',
        nullable: true,
    })
    declare createdAt: Date;

    @Field({
        description: '订单号',
        nullable: true,
    })
    outTradeNo: string;

    @Field(() => StudentType, { nullable: true, description: '购买学员' })
    student: StudentType;

    @Field(() => OrganizationType, { nullable: true, description: '机构' })
    organization: OrganizationType;

    @Field(() => ProductType, { nullable: true, description: '商品' })
    product: ProductType;
}

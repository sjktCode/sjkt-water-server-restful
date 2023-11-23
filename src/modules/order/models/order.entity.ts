import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { CommonEntity } from '@/common/entities/common.entity';
import { Organization } from '@/modules/organization/models/organization.entity';
import { Product } from '@/modules/product/models/product.entity';
import { Student } from '@/modules/student/models/student.entity';
import { Wxorder } from '@/modules/wxorder/models/wxorder.entity';

/**
 * 商品订单实体
 */
@Entity('order')
export class Order extends CommonEntity {
    @Column({
        comment: '订单号',
        default: '',
    })
    outTradeNo: string;

    @Column({
        comment: '手机号',
        nullable: true,
    })
    tel: string;

    @Column({
        comment: '数量',
        nullable: true,
    })
    quantity: number;

    @Column({
        comment: '总金额',
        nullable: true,
    })
    amount: number;

    @Column({
        comment: '支付状态',
        nullable: true,
    })
    status: string;

    @ManyToOne(() => Organization, {
        cascade: true,
    })
    organization: Organization;

    @ManyToOne(() => Product, {
        cascade: true,
    })
    product: Product;

    @ManyToOne(() => Student, {
        cascade: true,
    })
    student: Student;

    @OneToOne(() => Wxorder, (wxorder) => wxorder.order, { cascade: true })
    wxOrder?: Wxorder;
}

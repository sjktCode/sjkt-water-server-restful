import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Exclude()
@Entity('user')
export class UserEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column({
        comment: '昵称',
        default: '',
    })
    @IsNotEmpty()
    name: string;

    @Expose()
    @Column({
        comment: '描述信息',
        default: '',
    })
    desc: string;

    @Expose()
    @Column({
        comment: '手机号',
        nullable: true,
    })
    tel: string;

    @Column({
        comment: '密码',
        nullable: true,
    })
    password: string;

    @Expose()
    @Column({
        comment: '头像',
        nullable: true,
    })
    avatar: string;

    @Column({
        comment: '验证码',
        nullable: true,
    })
    code: string;

    @Column({
        comment: '验证码生成时间',
        nullable: true,
    })
    codeCreateTimeAt: Date;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '用户创建时间',
    })
    createdAt!: Date;

    @Expose()
    @Type(() => Date)
    @UpdateDateColumn({
        comment: '用户更新时间',
    })
    updatedAt!: Date;

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt!: Date;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isFunction, isNil, omit } from 'lodash';
import { EntityNotFoundError, Repository, SelectQueryBuilder } from 'typeorm';

import { paginate } from '@/modules/database/helpers';

import { QueryHook } from '../database/types';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto/user.dto';
import { UserEntity } from './models/user.entity';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private repository: Repository<UserEntity>) {}

    /**
     * 构建基础查询器
     */
    buildBaseQB(): SelectQueryBuilder<UserEntity> {
        return this.repository.createQueryBuilder('user');
    }

    async paginate(options: QueryUserDto) {
        const { orderBy } = options;
        const qb = this.buildBaseQB().orderBy(`user.${orderBy}`, 'ASC');
        return paginate(qb, options);
    }

    /**
     * 查询单个用户
     * @param id
     * @param callback 添加额外的查询
     */
    async detail(id: string, callback?: QueryHook<UserEntity>) {
        let qb = this.buildBaseQB();
        qb.where(`user.id = :id`, { id });
        qb = !isNil(callback) && isFunction(callback) ? await callback(qb) : qb;
        const item = await qb.getOne();
        if (!item) throw new EntityNotFoundError(UserEntity, `The user ${id} not exists!`);
        return item;
    }

    // 新增一个用户
    async create(data: CreateUserDto) {
        const item = await this.repository.save(data);
        return this.detail(item.id);
    }

    // 删除一个用户
    async delete(id: string): Promise<UserEntity> {
        const user = await this.repository.findOne({ where: { id } });
        return this.repository.remove(user);
    }

    // 更新一个用户
    async update(data: UpdateUserDto) {
        await this.repository.update(data.id, omit(data, ['id']));
        return this.detail(data.id);
    }

    // 查询一个用户 通过手机号
    async findByTel(tel: string): Promise<UserEntity> {
        const item = await this.repository.findOne({
            where: {
                tel,
            },
        });
        if (!item) throw new EntityNotFoundError(UserEntity, `The user ${tel} not exists!`);
        return item;
    }

    // 更新一个用户的验证码
    async updateCode(id: string, code: string): Promise<boolean> {
        const res = await this.repository.update(id, {
            code,
            codeCreateTimeAt: new Date(),
        });
        if (res.affected > 0) {
            return true;
        }
        return false;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, FindOptionsWhere } from 'typeorm';

import { ProductStatus } from '@/common/constants/enum';

import { Product } from './models/product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async create(entity: DeepPartial<Product>): Promise<boolean> {
        const res = await this.productRepository.save(this.productRepository.create(entity));
        if (res) {
            return true;
        }
        return false;
    }

    async findById(id: string): Promise<Product> {
        return this.productRepository.findOne({
            where: {
                id,
            },
            relations: ['organization', 'cards', 'cards.course'],
        });
    }

    async updateById(id: string, entity: DeepPartial<Product>): Promise<boolean> {
        const existEntity = await this.findById(id);
        if (!existEntity) {
            return false;
        }
        Object.assign(existEntity, entity);
        const res = await this.productRepository.save(existEntity);
        if (res) {
            return true;
        }
        return false;
    }

    async findProducts({
        start,
        length,
        where,
    }: {
        start: number;
        length: number;
        where: FindOptionsWhere<Product>;
    }): Promise<[Product[], number]> {
        return this.productRepository.findAndCount({
            take: length,
            skip: start,
            where,
            order: {
                createdAt: 'DESC',
            },
            relations: ['organization'],
        });
    }

    /**
     * 按照坐标距离排序
     * @param param0
     * @returns
     */
    async findProductsOrderByDistance({
        start,
        length,
        where,
        position,
    }: {
        start: number;
        length: number;
        where: FindOptionsWhere<Product>;
        position: {
            latitude: number;
            longitude: number;
        };
    }): Promise<{ entities: Product[]; raw: any[] }> {
        return this.productRepository
            .createQueryBuilder('product')
            .select('product')
            .addSelect(
                `
        ST_Distance(ST_GeomFromText('POINT(${position.latitude} ${position.longitude})', 4326), 
        ST_GeomFromText(CONCAT('POINT(', organization.latitude, ' ', organization.longitude, ')'), 4326))
      `,
                'distance',
            )
            .innerJoinAndSelect('product.organization', 'organization')
            .where(`product.status = '${ProductStatus.LIST}'`)
            .andWhere(`product.name LIKE '%${(where.name as string) || ''}%'`)
            .andWhere(where.type ? `product.type = '${where.type as string}'` : '1=1')
            .orderBy('distance', 'ASC')
            .take(length)
            .skip(start)
            .getRawAndEntities();
    }

    async getCount(options: { where: FindOptionsWhere<Product> }) {
        return this.productRepository.count(options);
    }

    async deleteById(id: string, userId: string): Promise<boolean> {
        const res1 = await this.productRepository.update(id, {
            deletedBy: userId,
        });
        if (res1) {
            const res = await this.productRepository.softDelete(id);
            if (res.affected > 0) {
                return true;
            }
        }
        return false;
    }
}

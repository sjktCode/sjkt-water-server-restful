import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './models/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [ProductService, ProductResolver],
    exports: [ProductService],
})
export class ProductModule {}

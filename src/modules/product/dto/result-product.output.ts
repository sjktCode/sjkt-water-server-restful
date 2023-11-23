import { ObjectType } from '@nestjs/graphql';

import { createResult, createResults } from '@/common/dto/result.type';

import { ProductTypeType } from './product-type.type';
import { ProductType } from './product.type';

@ObjectType()
export class ProductResult extends createResult(ProductType) {}

@ObjectType()
export class ProductResults extends createResults(ProductType) {}

@ObjectType()
export class ProductTypesResults extends createResults(ProductTypeType) {}

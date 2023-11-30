import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '@/common/guards/auth.guards';

import { OSSType } from './dto/oss.type';
import { OSSService } from './oss.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class OSSResolver {
    constructor(private readonly ossService: OSSService) {}

    @Query(() => OSSType, { description: '获取 oss 相关信息' })
    async getOSSInfo(): Promise<OSSType> {
        return this.ossService.getSignature();
    }
}

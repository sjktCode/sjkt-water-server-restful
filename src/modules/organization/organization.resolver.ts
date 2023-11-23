import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FindOptionsWhere, Like } from 'typeorm';

import { ORG_FAIL, ORG_NOT_EXIST, SUCCESS } from '@/common/constants/code';

import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { Result } from '@/common/dto/result.type';
import { GqlAuthGuard } from '@/common/guards/auth.guards';

import { COURSE_DEL_FAIL, COURSE_NOT_EXIST } from '../../common/constants/code';

import { OrgImageService } from '../orgImage/orgImage.service';

import { OrganizationInput } from './dto/organization.input';
import { OrganizationType } from './dto/organization.type';
import { OrganizationResult, OrganizationResults } from './dto/result-organization.output';
import { Organization } from './models/organization.entity';
import { OrganizationService } from './organization.service';

@Resolver(() => OrganizationType)
@UseGuards(GqlAuthGuard)
export class OrganizationResolver {
    constructor(
        private readonly organizationService: OrganizationService,
        private readonly orgImageService: OrgImageService,
    ) {}

    @Query(() => OrganizationResult)
    async getOrganizationInfo(@Args('id') id: string): Promise<OrganizationResult> {
        const result = await this.organizationService.findById(id);
        if (result) {
            return {
                code: SUCCESS,
                data: result,
                message: '获取成功',
            };
        }
        return {
            code: COURSE_NOT_EXIST,
            message: '门店信息不存在',
        };
    }

    @Mutation(() => OrganizationResult)
    async commitOrganization(
        @Args('params') params: OrganizationInput,
        @CurUserId() userId: string,
        @Args('id', { nullable: true }) id: string,
    ): Promise<Result> {
        if (id) {
            const organization = await this.organizationService.findById(id);
            if (!organization) {
                return {
                    code: ORG_NOT_EXIST,
                    message: '门店信息不存在',
                };
            }
            const delRes = await this.orgImageService.deleteByOrg(id);
            if (!delRes) {
                return {
                    code: ORG_FAIL,
                    message: '图片删除不成功，无法更新门店信息',
                };
            }
            const res = await this.organizationService.updateById(id, {
                ...params,
                updatedBy: userId,
            });
            if (res) {
                return {
                    code: SUCCESS,
                    message: '更新成功',
                };
            }
        }
        const res = await this.organizationService.create({
            ...params,
            createdBy: userId,
        });
        if (res) {
            return {
                code: SUCCESS,
                message: '创建成功',
            };
        }
        return {
            code: ORG_FAIL,
            message: '操作失败',
        };
    }

    @Query(() => OrganizationResults)
    async getOrganizations(
        @Args('page') page: PageInput,
        @CurUserId() userId: string,
        @Args('name', { nullable: true }) name?: string,
    ): Promise<OrganizationResults> {
        const { pageNum, pageSize } = page;
        const where: FindOptionsWhere<Organization> = { createdBy: userId };
        if (name) {
            where.name = Like(`%${name}%`);
        }
        const [results, total] = await this.organizationService.findOrganizations({
            start: (pageNum - 1) * pageSize,
            length: pageSize,
            where,
        });
        return {
            code: SUCCESS,
            data: results,
            page: {
                pageNum,
                pageSize,
                total,
            },
            message: '获取成功',
        };
    }

    @Mutation(() => Result)
    async deleteOrganization(@Args('id') id: string, @CurUserId() userId: string): Promise<Result> {
        const result = await this.organizationService.findById(id);
        if (result) {
            const delRes = await this.organizationService.deleteById(id, userId);
            if (delRes) {
                return {
                    code: SUCCESS,
                    message: '删除成功',
                };
            }
            return {
                code: COURSE_DEL_FAIL,
                message: '删除失败',
            };
        }
        return {
            code: COURSE_NOT_EXIST,
            message: '门店信息不存在',
        };
    }
}

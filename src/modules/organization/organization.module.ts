import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrgImage } from '../orgImage/models/orgImage.entity';

import { OrgImageService } from '../orgImage/orgImage.service';

import { Organization } from './models/organization.entity';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';

@Module({
    imports: [TypeOrmModule.forFeature([Organization, OrgImage])],
    providers: [OrganizationService, OrganizationResolver, OrgImageService],
    exports: [OrganizationService],
})
export class OrganizationModule {}

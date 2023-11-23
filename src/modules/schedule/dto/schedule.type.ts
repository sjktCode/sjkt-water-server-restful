import { Field, ObjectType } from '@nestjs/graphql';

import { CommonType } from '@/common/dto/common.type';
import { CourseType } from '@/modules/course/dto/course.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { ScheduleRecordType } from '@/modules/schedule-record/dto/schedule-record.type';
import { TeacherType } from '@/modules/teacher/dto/teacher.type';

/**
 * 课程表
 */
@ObjectType()
export class ScheduleType extends CommonType {
    @Field({
        description: 'id',
    })
    declare id: string;

    @Field({
        description: '上课日期',
        nullable: true,
    })
    schoolDay: Date;

    @Field({
        description: '开始时间',
        nullable: true,
    })
    startTime: string;

    @Field({
        description: '结束时间',
        nullable: true,
    })
    endTime: string;

    @Field({
        description: '人数限制',
        nullable: true,
    })
    limitNumber: number;

    @Field(() => CourseType, { nullable: true, description: '课程实体信息' })
    course: CourseType;

    @Field(() => OrganizationType, { nullable: true, description: '机构信息' })
    organization: OrganizationType;

    @Field(() => TeacherType, { nullable: true, description: '老师' })
    teacher?: TeacherType;

    @Field(() => [ScheduleRecordType], {
        nullable: true,
        description: '预约记录',
    })
    scheduleRecords?: ScheduleRecordType[];
}

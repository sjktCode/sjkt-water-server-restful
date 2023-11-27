import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './modules/auth/auth.module';
import { CardModule } from './modules/card/card.module';
import { CardRecordModule } from './modules/cardrecord/card-record.module';
import { CourseModule } from './modules/course/course.module';
import { OrderModule } from './modules/order/order.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { OSSModule } from './modules/oss/oss.module';
import { ProductModule } from './modules/product/product.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { ScheduleRecordModule } from './modules/schedule-record/schedule-record.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { UserModule } from './modules/user/user.module';
import { WxorderModule } from './modules/wxorder/wxorder.module';
import { WxpayModule } from './modules/wxpay/wxpay.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppFilter, AppIntercepter, AppPipe } from './modules/core/providers';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';
import { DatabaseModule } from './modules/database/database.module';
import { MeilliModule } from './modules/meilisearch/melli.module';
import { content, database, meilli } from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ContentModule.forRoot(content),
        CoreModule.forRoot(),
        DatabaseModule.forRoot(database),
        MeilliModule.forRoot(meilli),
        CoreModule,
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: './schema.gql',
        }),
        UserModule,
        OSSModule,
        AuthModule,
        StudentModule,
        OrganizationModule,
        CourseModule,
        CardModule,
        ProductModule,
        WxpayModule,
        OrderModule,
        WxorderModule,
        TeacherModule,
        CardRecordModule,
        ScheduleModule,
        ScheduleRecordModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new AppPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
        {
            provide: APP_FILTER,
            useClass: AppFilter,
        },
        AppService
    ],
})
export class AppModule {}

/**
 * 数据库配置
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const database = (): TypeOrmModuleOptions => ({
    // 以下为mysql配置
    charset: 'utf8mb4',
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    // eslint-disable-next-line radix
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [`${__dirname}/../module/**/*.entity{.ts,.js}`],
    logging: ['error'],
    synchronize: true,
    autoLoadEntities: true,
});

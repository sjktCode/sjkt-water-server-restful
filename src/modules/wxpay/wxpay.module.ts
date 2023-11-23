import { Module } from '@nestjs/common';

import { CardRecordModule } from '../cardrecord/card-record.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { StudentModule } from '../student/student.module';

import { WxorderModule } from '../wxorder/wxorder.module';

import { WxpayController } from './wxpay.controller';
import { WxpayResolver } from './wxpay.resolver';

@Module({
    controllers: [WxpayController],
    providers: [WxpayResolver],
    imports: [
        StudentModule,
        ProductModule,
        OrderModule,
        WxorderModule,
        CardRecordModule,
        // WeChatPayModule.registerAsync({
        //     useFactory: async () => {
        //         return {
        //             appid: process.env.WXPAY_APPID,
        //             mchid: process.env.WXPAY_MCHID,
        //             publicKey: fs.readFileSync(`./apiclient_cert.pem`), // 公钥
        //             privateKey: fs.readFileSync(`./apiclient_key.pem`), // 秘钥
        //         };
        //     },
        // }),
    ],
})
export class WxpayModule {}

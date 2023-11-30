import * as Dysmsapi from '@alicloud/dysmsapi20170525';
import Util, * as utils from '@alicloud/tea-util';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

import md5 from 'md5';

import {
    ACCOUNT_EXIST,
    ACCOUNT_NOT_EXIST,
    CODE_NOT_EXIST,
    CODE_NOT_EXPIRE,
    CODE_SEND_ERROR,
    LOGIN_ERROR,
    REGISTER_ERROR,
    SUCCESS,
    UPDATE_ERROR,
} from '@/common/constants/code';
import { getRandomCode, accountAndPwdValidate } from '@/shared/utils';
import { msgClient } from '@/shared/utils/msg';

import { StudentService } from '../student/student.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly studentService: StudentService,
    ) {}

    async sendCodeMsg(tel: string) {
        const user = await this.userService.findByTel(tel);
        if (user) {
            const diffTime = dayjs().diff(dayjs(user.codeCreateTimeAt));
            if (diffTime < 60 * 1000) {
                const error = {
                    code: CODE_NOT_EXPIRE,
                    message: 'code 尚未过期',
                };
                throw new ForbiddenException(error);
            }
        }
        const code = getRandomCode();
        const sendSmsRequest = new Dysmsapi.SendSmsRequest({
            signName: process.env.SIGN_NAME,
            templateCode: process.env.TEMPLATE_CODE,
            phoneNumbers: tel,
            templateParam: `{"code":"${code}"}`,
        });
        const runtime = new utils.RuntimeOptions({});
        try {
            const sendRes = await msgClient.sendSmsWithOptions(sendSmsRequest, runtime);
            if (sendRes.body.code !== 'OK') {
                const error = {
                    code: CODE_SEND_ERROR,
                    message: sendRes.body.message,
                };
                throw new ForbiddenException(error);
            }
            if (user) {
                const result = await this.userService.updateCode(user.id, code);
                if (result) {
                    return {
                        message: '获取验证码成功',
                    };
                }
                const error = {
                    code: UPDATE_ERROR,
                    message: '更新 code 失败',
                };
                throw new ForbiddenException(error);
            }
            const result = await this.userService.create({
                tel,
                code,
                codeCreateTimeAt: new Date(),
            });
            if (result) {
                return {
                    message: '获取验证码成功',
                };
            }
            const error = {
                code: UPDATE_ERROR,
                message: '新建账号失败',
            };
            throw new ForbiddenException(error);
        } catch (error) {
            // 如有需要，请打印 error
            Util.assertAsString((error as any).message);
            throw new ForbiddenException(error);
        }
    }

    async login(tel: string, code: string) {
        const user = await this.userService.findByTel(tel);
        if (!user) {
            const error = {
                code: ACCOUNT_NOT_EXIST,
                message: '账号不存在',
            };
            throw new ForbiddenException(error);
        }
        if (!user.codeCreateTimeAt || !user.code) {
            const error = {
                code: CODE_NOT_EXIST,
                message: '验证码不存在',
            };
            throw new ForbiddenException(error);
        }
        if (dayjs().diff(dayjs(user.codeCreateTimeAt)) > 60 * 60 * 1000) {
            const error = {
                code: CODE_NOT_EXPIRE,
                message: '验证码过期',
            };
            throw new ForbiddenException(error);
        }
        if (user.code === code) {
            const token = this.jwtService.sign({
                id: user.id,
            });
            return {
                data: token,
            };
        }
        const error = {
            code: LOGIN_ERROR,
            message: '登录失败，手机号或者验证码不对',
        };
        throw new ForbiddenException(error);
    }

    async studentLogin(account: string, password: string) {
        const result = accountAndPwdValidate(account, password);
        if (result.code !== SUCCESS) {
            return result;
        }
        const student = await this.studentService.findByAccount(account);
        if (!student) {
            const error = {
                code: ACCOUNT_NOT_EXIST,
                message: '账号不存在',
            };
            throw new ForbiddenException(error);
        }
        // 需要对密码进行 md5 加密
        if (student.password === md5(password)) {
            const token = this.jwtService.sign({
                id: student.id,
            });
            return {
                data: token,
            };
        }
        const error = {
            code: LOGIN_ERROR,
            message: '登录失败，手机号或者验证码不对',
        };
        throw new ForbiddenException(error);
    }

    async studentRegister(account: string, password: string) {
        const result = accountAndPwdValidate(account, password);
        if (result.code !== SUCCESS) {
            return result;
        }
        const student = await this.studentService.findByAccount(account);
        if (student) {
            const error = {
                code: ACCOUNT_EXIST,
                message: '账号已经存在，请使用其他账号',
            };
            throw new ForbiddenException(error);
        }
        const res = await this.studentService.create({
            account,
            password: md5(password),
        });
        if (res) {
            return {
                message: '注册成功',
            };
        }
        const error = {
            code: REGISTER_ERROR,
            message: '注册失败',
        };
        throw new ForbiddenException(error);
    }
}

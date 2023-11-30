import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurOrgId = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const orgId = request.headers.orgid;
    return orgId;
});

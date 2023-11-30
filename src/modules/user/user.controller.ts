import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { CurUserId } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth.guards';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async list(
        @Query()
        options: QueryUserDto,
    ) {
        return this.userService.paginate(options);
    }

    @Get(':id')
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.userService.detail(id);
    }

    @Get('currentUser')
    async getCurrentUser(@CurUserId() userId: string) {
        return this.userService.detail(userId);
    }

    @Post()
    async store(
        @Body()
        data: CreateUserDto,
    ) {
        return this.userService.create(data);
    }

    @Patch()
    async update(
        @Body()
        data: UpdateUserDto,
    ) {
        return this.userService.update(data);
    }

    @Delete(':id')
    async delete(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.userService.delete(id);
    }
}

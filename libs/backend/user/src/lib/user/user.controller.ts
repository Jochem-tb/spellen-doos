import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
import { Get, Put, Param, Body } from "@nestjs/common";
import { IUser } from "@spellen-doos/shared/api";


@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<IUser[]> {
        return this.userService.findAll();
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: IUser): Promise<IUser | null> {
        return this.userService.updateUser(id, user);
    }
}
import { UserService } from "./user.service";
import { Get, Put, Param, Body, Controller } from "@nestjs/common";
import { IUser } from "@spellen-doos/shared/api";


@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get() // Gets all users
    async findAll(): Promise<IUser[]> {
        return this.userService.findAll();
    }

    @Get(':id') // Get user by ID
    async findById(@Param('id') id: string): Promise<IUser | undefined | null> {
        return this.userService.findById(id);
    }

    @Put(':id') // Update user by ID
    async updateUser(@Param('id') id: string, @Body() user: IUser): Promise<IUser | null> {
        return this.userService.updateUser(id, user);
    }
}
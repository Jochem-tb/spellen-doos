import { UserService } from "./user.service";
import { Get, Put, Param, Body, Controller, Logger } from "@nestjs/common";
import { IUser } from "@spellen-doos/shared/api";


@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get() // Gets all users
    async findAll(): Promise<IUser[]> {
        return this.userService.findAll();
    }

    @Get("check-username/:username")
    async checkUsername(@Param("username") username: string): Promise<{ exists: boolean }> {
        Logger.debug(`Checking username ${username}`);
        const userExists = await this.userService.findByUsername(username);
        Logger.debug(`User exists: ${userExists ? true : false}`);
        return { exists: !!userExists };
    }
  
    // @Put()
    // async updateUser(user: IUser): Promise<IUser | null> {
    //     return this.userService.updateUser(user);
    
    @Get(':id') // Get user by ID
    async findById(@Param('id') id: string): Promise<IUser | undefined | null> {
        return this.userService.findById(id);
    }

    @Put(':id') // Update user by ID
    async updateUser(@Param('id') id: string, @Body() user: IUser): Promise<IUser | null> {
        return this.userService.updateUser(id, user);
    }
}
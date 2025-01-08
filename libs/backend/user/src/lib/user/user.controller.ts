import { Controller, Logger, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { Get, Put } from "@nestjs/common";
import { IUser } from "@spellen-doos/shared/api";


@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<IUser[]> {
        return this.userService.findAll();
    }

    @Get('check-username/:username')
    async checkUsername(@Param('username') username: string): Promise<{ exists: boolean }> {
        Logger.debug(`Checking username ${username}`);
        const userExists = await this.userService.findByUsername(username);
        Logger.debug(`User exists: ${userExists ? true : false}`);
        return { exists: !!userExists };
    }
  
    @Put()
    async updateUser(user: IUser): Promise<IUser | null> {
        return this.userService.updateUser(user);
    }

}
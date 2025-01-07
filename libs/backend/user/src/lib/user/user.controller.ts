import { Controller } from "@nestjs/common";
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

    @Put()
    async updateUser(user: IUser): Promise<IUser | null> {
        return this.userService.updateUser(user);
    }

}
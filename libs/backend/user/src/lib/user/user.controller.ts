import { Controller } from "@nestjs/common";
import { UserService } from "./user.service";
import { 
    Get 
} from "@nestjs/common";
import { IUser } from "@spellen-doos/shared/api";


@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<IUser[]> {
        return this.userService.findAll();
    }

}
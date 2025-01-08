import { Body, Controller, Logger, Post, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "@spellen-doos/backend/dto";
import { Public } from "./decorators/decorators";
import { IUser, IUserCredentials, IUserIdentity } from "@spellen-doos/shared/api";
import { UserExistsGuard } from "@spellen-doos/backend-user";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post("login")
    async login(@Body() credentials: IUserCredentials): Promise<IUserIdentity> {
        Logger.log(`Login attempt for user ${credentials.userName}`);
        return this.authService.login(credentials);
    }

    @Public()
    @UseGuards(UserExistsGuard)
    @Post("register")
    async register(@Body() registerDto: CreateUserDto) {
        Logger.log(`Register attempt for new user`);
        Logger.log(registerDto);
        return this.authService.register(registerDto);
    }
}
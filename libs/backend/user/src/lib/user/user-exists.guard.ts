import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { first, Observable } from "rxjs";
import { User } from "./user.schema";
import { UserService } from "./user.service";


@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userName } = request.body;

    const foundUser = await this.userService.findByUsername(userName);
    Logger.debug(foundUser);

    if (foundUser) {
      throw new BadRequestException('User with this name already exists');
    }

    return true;
  }
}
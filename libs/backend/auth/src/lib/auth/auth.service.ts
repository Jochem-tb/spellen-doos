import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUser, IUserCredentials, IUserIdentity, UserRole } from "@spellen-doos/shared/api";
import { UserDocument } from "@spellen-doos/backend-user";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel("User") private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async login(credentials: IUserCredentials): Promise<IUserIdentity> {
        return await this.userModel
            .findOne({ 
                userName: credentials.userName 
            })
            .select("+password")
            .exec()
            .then((user) => {
                if (user) {
                    const payload = { 
                        user_id: user._id 
                    };
                    return {
                        _id: user._id,
                        userName: user.userName,
                        dateOfBirth: user.dateOfBirth,
                        token: this.jwtService.sign(payload),
                    };
                } else {
                    const errMsg = "Username not found or password invalid";
                    throw new UnauthorizedException(errMsg);
                }
            })
            .catch((err) => {
                throw new UnauthorizedException(err);
            });
    }

    async register(user: IUser): Promise<IUser> {
        return this.userModel.create(user);
    }
}
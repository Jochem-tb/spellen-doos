import { ICreateUser, ProfilePictureEnum, UserRole } from "@spellen-doos/shared/api";
import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateUserDto implements ICreateUser {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsNotEmpty()
    dateOfBirth!: Date;

    @IsString()
    @IsNotEmpty()
    role!: UserRole;

    @IsString()
    @IsNotEmpty()
    profilePicture!: ProfilePictureEnum;
}
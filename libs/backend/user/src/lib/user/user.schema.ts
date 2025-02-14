import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser, ProfilePictureEnum, UserRole } from '@spellen-doos/shared/api';

export type UserDocument = IUser & Document;

@Schema()
export class User implements IUser {
  @Prop({
    required: true,
  })
  password!: string;

  @Prop({
    required: true,
    unique: true,
  })
  userName!: string;

  @Prop({ required: true })
  dateOfBirth!: Date;

  @Prop({ 
    required: false, 
    default: UserRole.User, 
    type: String 
  })
  role: UserRole = UserRole.User;

  @Prop({
    required: false,
    default: ProfilePictureEnum.Pic1,
    type: String
  })
  profilePicture!: ProfilePictureEnum;

  @Prop({
    required: false,
    default: false,
    type: String
  })
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
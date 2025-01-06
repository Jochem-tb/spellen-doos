import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser, UserRole } from '@spellen-doos/shared/api';

export type UserDocument = IUser & Document;

@Schema()
export class User implements IUser {
  @Prop({
    required: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  password!: string;

  @Prop({
    required: true,
    unique: true,
  })
  firstName!: string;

  @Prop({ required: true })
  dateOfBirth!: Date;

  @Prop({ required: true, default: UserRole.User, type: String })
  role: UserRole = UserRole.User;
}

export const UserSchema = SchemaFactory.createForClass(User);
import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {}

    async findAll (): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByUsername(userName: string): Promise<User | null> {
        return this.userModel.findOne({ userName }).exec();
    }

    async updateUser(user: User): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(user);
    }
}
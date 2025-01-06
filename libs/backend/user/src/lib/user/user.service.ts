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

    async findByEmail(firstName: string): Promise<User | undefined | null> {
        return this.userModel.findOne({
            firstName
        });
    }
}
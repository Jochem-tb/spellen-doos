import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  HelpButton as HelpButtonModel,
  HelpButtonDocument,
  HelpButton,
} from './helpButton.schema';
import {
  IHelpButton,
  IHelpButtonCreate,
  IHelpButtonUpdate,
} from '@spellen-doos/shared/api';
import { Observable, from, map } from 'rxjs';

@Injectable({})
export class HelpButtonService {
  private readonly logger: Logger = new Logger(HelpButtonService.name);

  constructor(
    @InjectModel(HelpButtonModel.name)
    private helpButtonModel: Model<HelpButtonDocument> // @InjectModel(Meal.name) private meetupModel: Model<MealDocument>
  ) {}

  async getContentByRoute(route: string): Promise<IHelpButton | null> {
    this.logger.log(`finding helpButtonContent by route ${route}`);
    const item = await this.helpButtonModel.findOne({ route }).exec();
    if (!item) {
      this.logger.debug('Item not found');
    }
    return item;
  }

  async create(helpButton: IHelpButtonCreate): Promise<IHelpButton> {
    this.logger.log(`Create helpButton with title:  ${helpButton.title}`);
    helpButton.createdAt = new Date();
    helpButton.updatedAt = new Date();
    const createdItem = this.helpButtonModel.create(helpButton);
    return createdItem;
  }

  async update(helpButton: IHelpButtonUpdate): Promise<IHelpButton> {
    this.logger.log(`Update helpButton with route:  ${helpButton.route}`);
    helpButton.updatedAt = new Date();
    const updatedItem = await this.helpButtonModel
      .findOneAndUpdate({ route: helpButton.route }, helpButton, { new: true })
      .exec();
    if (!updatedItem) {
      throw new HttpException(
        `HelpButton with route: ${helpButton.route} not found`,
        404
      );
    }
    return updatedItem;
  }
}

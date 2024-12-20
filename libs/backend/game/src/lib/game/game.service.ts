import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Game as GameModel, GameDocument } from './game.schema';
import { ITutorialStep, IGame } from '@spellen-doos/shared/api';
import { Observable, from, map } from 'rxjs';

@Injectable({})
export class GameService {
  private readonly logger: Logger = new Logger(GameService.name);

  constructor(
    @InjectModel(GameModel.name)
    private gameModel: Model<GameDocument> // @InjectModel(Meal.name) private meetupModel: Model<MealDocument>
  ) {}

  async findAll(): Promise<IGame[]> {
    this.logger.log(`Finding all items`);
    const items = await this.gameModel.find();
    return items;
  }

  async findOne(_id: string): Promise<IGame | null> {
    this.logger.log(`finding game with id ${_id}`);
    const item = await this.gameModel.findOne({ _id }).exec();
    if (!item) {
      this.logger.debug('Item not found');
    }
    return item;
  }

  // async create(game: CreateGameDto): Promise<IGame> {
  //   this.logger.log(`Create game with title:  ${game.title}`);
  //   game.createdAt = new Date();
  //   game.updatedAt = new Date();
  //   const createdItem = this.gameModel.create(game);
  //   return createdItem;
  // }

  // async update(_id: string, game: UpdateGameDto): Promise<IGame | null> {
  //   this.logger.log(`Update game ${game.title}`);
  //   game.updatedAt = new Date();
  //   return this.gameModel.findByIdAndUpdate({ _id }, game);
  // }
}

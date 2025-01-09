import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  GameRPSServerSchema as GameRPSServerModel,
  GameRPSServerDocument,
} from './gameServer.schema';
import { ITutorialStep, IGame } from '@spellen-doos/shared/api';
import { Observable, from, map } from 'rxjs';

@Injectable({})
export class GameServerService {
  private readonly logger: Logger = new Logger(GameServerService.name);

  constructor(
    @InjectModel('GameRPSServer')
    private gameServerModel: Model<GameRPSServerDocument> // @InjectModel(Meal.name) private meetupModel: Model<MealDocument>
  ) {}

  private connectedPlayers: string[] = [];

  async getConnectedPlayers(): Promise<string[]> {
    return this.connectedPlayers;
  }
}

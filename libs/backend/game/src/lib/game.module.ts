import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game/game.schema';
import { RPSGameServerControllerGateway } from './gameServer/rps/rpsGameServer.gateway';
import { BingoGameServerControllerGateway } from './gameServer/bingo/bingoGameServer.gateway';
// import { Meal, MealSchema } from '@avans-nx-game/backend/features';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    RPSGameServerControllerGateway,
    BingoGameServerControllerGateway,
  ],
  exports: [GameService],
})
export class GameModule {}

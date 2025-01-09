import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game/game.schema';
import { RPSGameServerControllerGateway } from './gameServer/gameServer.gateway';
// import { Meal, MealSchema } from '@avans-nx-game/backend/features';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  controllers: [GameController],
  providers: [GameService, RPSGameServerControllerGateway],
  exports: [GameService],
})
export class GameModule {}

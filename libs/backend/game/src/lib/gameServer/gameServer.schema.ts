// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Schema as MongooseSchema } from 'mongoose';
// // import { v4 as uuid } from 'uuid';
// import { IGame, IGameServer, ITutorialStep } from '@spellen-doos/shared/api';
// import { IsMongoId } from 'class-validator';

// export type GameRPSServerDocument = IGameServer & Document;

// @Schema()
// export class RPSGameServerController implements IGameServer {
//   @Prop({ required: true, type: [String] })
//   queue: string[] = [];

//   @Prop({ required: true, type: Number })
//   minPlayerForGame: number = -1;

//   @Prop({ required: true, type: Number })
//   maxPlayerForGame: number = -1;

//   @Prop({ required: true, type: Number })
//   recommendedPlayerForGame: number = -1;

//   @Prop({ required: true, type: Object })
//   game?: IGame;

//   @Prop({ required: true, type: [String] })
//   connectedPlayers: string[] = [];
// }

// export const GameRPSServerSchema = SchemaFactory.createForClass(
//   RPSGameServerController
// );

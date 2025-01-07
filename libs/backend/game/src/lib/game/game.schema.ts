import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { v4 as uuid } from 'uuid';
import { IGame, ITutorialStep } from '@spellen-doos/shared/api';
import { IsMongoId } from 'class-validator';

export type GameDocument = Game & Document;

@Schema()
export class Game implements IGame {
  @Prop({ required: true, type: String })
  name: string = 'Nieuwe game';

  @Prop({ required: true, type: String })
  shortDescription?: string | undefined;

  @Prop({ required: true, type: String })
  longDescription?: string | undefined;

  @Prop({ required: true, type: Array })
  tutorialSteps?: ITutorialStep[] | undefined;

  @Prop({ required: true, type: String })
  cardImage: string = '/assets/game/placeholder.png';

  @Prop({ required: true, type: Number })
  maxPlayers: number = 0;

  @Prop({ required: true, type: Number })
  minPlayers: number = 0;

  @IsMongoId()
  _id!: string;

  @Prop({ required: true, type: Date, default: new Date() })
  createdAt!: Date;

  @Prop({ required: true, type: Date, default: new Date() })
  updatedAt!: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);

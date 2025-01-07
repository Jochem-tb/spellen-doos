import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { v4 as uuid } from 'uuid';
import { IHelpButton } from '@spellen-doos/shared/api';
import { IsMongoId } from 'class-validator';

export type HelpButtonDocument = HelpButton & Document;

@Schema()
export class HelpButton implements IHelpButton {
  @Prop({ required: true, type: String })
  route!: string;

  @Prop({ required: true, type: String })
  title: string = 'Help';

  @Prop({ required: true, type: String })
  content!: string;

  @IsMongoId()
  _id!: string;

  @Prop({ required: true, type: Date, default: new Date() })
  createdAt!: Date;

  @Prop({ required: true, type: Date, default: new Date() })
  updatedAt!: Date;
}

export const HelpButtonSchema = SchemaFactory.createForClass(HelpButton);

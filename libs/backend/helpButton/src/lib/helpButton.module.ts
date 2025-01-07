import { Module } from '@nestjs/common';
import { HelpButtonController } from './helpButton/helpButton.controller';
import { HelpButtonService } from './helpButton/helpButton.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HelpButton, HelpButtonSchema } from './helpButton/helpButton.schema';
// import { Meal, MealSchema } from '@avans-nx-helpButton/backend/features';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelpButton.name, schema: HelpButtonSchema },
    ]),
  ],
  controllers: [HelpButtonController],
  providers: [HelpButtonService],
  exports: [HelpButtonService],
})
export class HelpButtonModule {}

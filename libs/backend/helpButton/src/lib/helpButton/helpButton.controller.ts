import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HelpButtonService } from './helpButton.service';
import {
  ICreateGame,
  IGame,
  IHelpButton,
  IHelpButtonCreate,
  IUpdateGame,
} from '@spellen-doos/shared/api';

import { HelpButton } from './helpButton.schema';

@Controller('helpButton')
export class HelpButtonController {
  constructor(private readonly helpButtonService: HelpButtonService) {}

  @Get()
  async getContentByRoute(
    @Query('route') route: string
  ): Promise<IHelpButton | null> {
    return this.helpButtonService.getContentByRoute(route);
  }

  @Post()
  create(@Body() helpButton: IHelpButtonCreate): Promise<IHelpButton> {
    return this.helpButtonService.create(helpButton);
  }
}

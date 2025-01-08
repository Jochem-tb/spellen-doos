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
import { RouteExistsGuard } from './route-exists.guard';

@Controller('helpButton')
export class HelpButtonController {
  constructor(private readonly helpButtonService: HelpButtonService) {}

  @Get()
  async getContentByRoute(
    @Query('route') route: string
  ): Promise<IHelpButton | null> {
    return this.helpButtonService.getContentByRoute(route);
  }

  @UseGuards(RouteExistsGuard)
  @Post()
  create(@Body() helpButton: IHelpButtonCreate): Promise<IHelpButton> {
    return this.helpButtonService.create(helpButton);
  }

  @Put()
  update(@Body() helpButton: IHelpButtonCreate): Promise<IHelpButton> {
    return this.helpButtonService.update(helpButton);
  }
}

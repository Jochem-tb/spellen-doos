import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { ICreateGame, IGame, IUpdateGame } from '@spellen-doos/shared/api';

import { Game } from './game.schema';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  async findAll() {
    return await this.gameService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<IGame | null> {
  //   return this.gameService.findOne(id);
  // }

}

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { GameRPSServerDocument } from './gameServer.schema';
import {
  IGame,
  IRPSGameServer,
  IRPSRoundInfo,
  RPSChoicesEnum,
} from '@spellen-doos/shared/api';

@Injectable({})
export class RPSGameServerController implements IRPSGameServer {
  maxRounds: number = 0;
  currentRound: number = 0;

  playerAWins: number = 0;
  playerBWins: number = 0;
  draws: number = 0;

  playerAChoice?: RPSChoicesEnum;
  playerBChoice?: RPSChoicesEnum;

  playerAConnected: boolean = false;
  playerBConnected: boolean = false;
  roundsInfo: IRPSRoundInfo[] = [];

  

  constructor() {}

  public connectedPlayers: string[] = [];

  async getConnectedPlayers(): Promise<string[]> {
    return this.connectedPlayers;
  }
}

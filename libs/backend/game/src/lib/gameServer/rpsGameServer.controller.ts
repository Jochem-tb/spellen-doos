import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
// import { GameRPSServerDocument } from './gameServer.schema';
import {
  BaseGatewayEvents,
  IGame,
  IRPSGameServer,
  IRPSRoundInfo,
  RPSChoicesEnum,
  RPSGameEvents,
} from '@spellen-doos/shared/api';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
// })
export class RPSGameServerController implements IRPSGameServer {
  maxRounds: number = 0;
  currentRound: number = 0;

  playerAWins: number = 0;
  playerBWins: number = 0;
  draws: number = 0;

  playerAChoice?: RPSChoicesEnum;
  playerBChoice?: RPSChoicesEnum;

  readonly playerA: Socket;
  readonly playerB: Socket;
  roundsInfo: IRPSRoundInfo[] = [];

  // @WebSocketServer()
  // server!: Server;

  constructor(private readonly gameId: string, players: Socket[]) {
    [this.playerA, this.playerB] = players;
    console.log(`Game controller created for room: ${gameId}`);
  }

  changeChoice(clientId: string, choice: RPSChoicesEnum): void {
    if (this.playerA.id === clientId) {
      this.playerAChoice = choice;
    } else if (this.playerB.id === clientId) {
      this.playerBChoice = choice;
    } else {
      console.error(`Invalid clientId: ${clientId} for game: ${this.gameId}`);
      return;
    }

    console.log(
      `Player ${clientId} selected ${choice}. Current choices:`,
      this.playerAChoice,
      this.playerBChoice
    );

    if (this.playerAChoice && this.playerBChoice) {
      this.evaluateRound();
    }
  }

  private evaluateRound(): void {
    console.log(
      `Evaluating round for game ${this.gameId}:`,
      this.playerAChoice,
      this.playerBChoice
    );

    // Determine the winner logic here
    // Example: Rock > Scissors, Scissors > Paper, Paper > Rock

    // Reset for the next round
    this.playerAChoice = undefined;
    this.playerBChoice = undefined;
  }
}

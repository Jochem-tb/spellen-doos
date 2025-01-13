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
  RPSWinnerEnum,
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
import { RPSGameServerControllerGateway } from './gameServer.gateway';

export class RPSGameServerController implements IRPSGameServer {
  maxRounds: number = 3;
  currentRound: number = 0;

  playerAWins: number = 0;
  playerBWins: number = 0;
  draws: number = 0;

  playerAChoice?: RPSChoicesEnum;
  playerBChoice?: RPSChoicesEnum;

  readonly playerA: Socket;
  readonly playerB: Socket;
  roundsInfo: IRPSRoundInfo[] = [];

  gateway!: RPSGameServerControllerGateway;

  constructor(
    private readonly gameId: string,
    players: Socket[],
    gateway: RPSGameServerControllerGateway
  ) {
    [this.playerA, this.playerB] = players;
    this.gateway = gateway;
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
      this.startCountDown();
    }
  }

  private startCountDown(): void {
    console.log('Starting countdown for round evaluation');
    let countDown = 5;
    let time;

    const interval = setInterval(() => {
      time = countDown;
      console.warn('Time:', time);
      this.gateway.broadcastToRoom(
        this.gameId,
        BaseGatewayEvents.DISPLAY_TIMER,
        {
          time,
        }
      );

      if (countDown === 0) {
        clearInterval(interval);
        this.evaluateRound();
      }

      countDown--;
    }, 1000);
  }

  private evaluateRound(): void {
    console.log('Player A & B have made their choices');

    let winner: RPSWinnerEnum;

    if (this.playerAChoice === this.playerBChoice) {
      this.draws++;
      winner = RPSWinnerEnum.Draw;
      console.log('Round result: Draw');
    } else if (
      (this.playerAChoice === RPSChoicesEnum.Steen &&
        this.playerBChoice === RPSChoicesEnum.Schaar) ||
      (this.playerAChoice === RPSChoicesEnum.Papier &&
        this.playerBChoice === RPSChoicesEnum.Steen) ||
      (this.playerAChoice === RPSChoicesEnum.Schaar &&
        this.playerBChoice === RPSChoicesEnum.Papier)
    ) {
      this.playerAWins++;
      console.log('Round result: Player A wins');
      winner = RPSWinnerEnum.PlayerA;
    } else {
      this.playerBWins++;
      winner = RPSWinnerEnum.PlayerB;
      console.log('Round result: Player B wins');
    }

    this.gateway.broadcastToRoom(this.gameId, RPSGameEvents.ROUND_RESULT, {
      round: this.currentRound + 1,
      playerAChoice: this.playerAChoice,
      playerBChoice: this.playerBChoice,
      result: winner,
      playerAWins: this.playerAWins,
      playerBWins: this.playerBWins,
      draws: this.draws,
    });

    this.roundsInfo.push({
      round: this.currentRound + 1,
      playerAChoice: this.playerAChoice!,
      playerBChoice: this.playerBChoice!,
      winner: winner,
    });

    this.currentRound++;

    // Reset for the next round
    this.playerAChoice = undefined;
    this.playerBChoice = undefined;
    console.log(
      `Round evaluation completed, PlayerA: ${this.playerAWins}, PlayerB: ${this.playerBWins}, Draws: ${this.draws}`
    );
  }
}

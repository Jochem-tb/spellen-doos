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

  timerActive: boolean = false;
  private activeInterval: NodeJS.Timeout | null = null; // Track the active interval

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
      this.playerAChoice = this.playerAChoice === choice ? undefined : choice;
      this.alertPlayerChange(this.playerA, this.playerAChoice);
    } else if (this.playerB.id === clientId) {
      this.playerBChoice = this.playerBChoice === choice ? undefined : choice;
      this.alertPlayerChange(this.playerB, this.playerBChoice);
    } else {
      console.error(
        `[ERROR] Invalid clientId: ${clientId} for game: ${this.gameId}`
      );
      return;
    }

    console.log(
      `[DEBUG] Player ${clientId} chose ${choice}. Current choices:`,
      { playerAChoice: this.playerAChoice, playerBChoice: this.playerBChoice }
    );

    // Stop the timer if it's active
    if (this.timerActive) {
      console.warn('[INFO] Timer is active. Stopping current countdown.');
      this.stopTimer();
    }

    // Restart timer only if both players have valid choices
    if (this.playerAChoice && this.playerBChoice) {
      this.startCountDown();
    }
  }

  private alertPlayerChange(
    player: Socket,
    choice: RPSChoicesEnum | undefined
  ) {
    this.gateway.broadcastToPlayer(player.id, RPSGameEvents.CHANGE_CHOICE, {
      choice,
    });
  }

  private stopTimer(): void {
    if (this.activeInterval) {
      clearInterval(this.activeInterval);
      this.activeInterval = null; // Ensure no dangling intervals
    }

    if (this.timerActive) {
      this.timerActive = false; // Mark timer as inactive
      console.log('[INFO] Timer stopped.');

      // Broadcast -1 to the room to indicate timer stop
      this.gateway.broadcastToRoom(
        this.gameId,
        BaseGatewayEvents.DISPLAY_TIMER,
        { time: -1 }
      );
    }
  }

  private startCountDown(): void {
    if (this.timerActive) {
      console.log('[INFO] Countdown is already active. Aborting new timer.');
      return;
    }

    // Clear any existing interval before starting a new one
    this.stopTimer();

    let countDown = 5; // Countdown duration

    console.log('[INFO] Starting countdown for round evaluation.');
    this.timerActive = true;

    this.activeInterval = setInterval(() => {
      if (!this.timerActive) {
        this.stopTimer(); // Ensure proper handling when timer is stopped
        return;
      }

      console.warn(`[TIMER] Countdown: ${countDown}`);
      this.gateway.broadcastToRoom(
        this.gameId,
        BaseGatewayEvents.DISPLAY_TIMER,
        { time: countDown }
      );

      if (countDown === 0) {
        this.stopTimer(); // Stop the timer after it finishes
        this.evaluateRound(); // Evaluate the round
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
      winner: winner,
      playerAWins: this.playerAWins,
      playerBWins: this.playerBWins,
      draws: this.draws,
      playerA: this.playerA.id,
      playerB: this.playerB.id,
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

import { Injectable, NgZone } from '@angular/core';
import {
  BaseGatewayEvents,
  RPSChoicesEnum,
  RPSGameEvents,
} from '@spellen-doos/shared/api';
import { Socket } from 'socket.io-client';
import { GameServerService } from '../waitScreen/gameServer.service';
import { RpsComponent } from './rps.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RPSService {
  private socket!: Socket;
  private roomId!: string;
  public component!: RpsComponent;

  constructor(
    private gameServerService: GameServerService,
    private router: Router,
    private zone: NgZone
  ) {
    this.initializeSocketConnection();
    this.roomId = this.router.url.split('/')[2];
  }

  private initializeSocketConnection(): void {
    this.socket = this.gameServerService.getSocket();
    if (!this.socket.connected) {
      this.socket.connect();
    }
    this.setupIncoming();
  }

  private setupIncoming(): void {
    this.socket.on(BaseGatewayEvents.PLAYER_DISCONNECT, (data: any) => {
      if (data.playerId !== this.socket.id) {
        this.playerDisconnected(data.playerId);
      }
    });

    this.socket.on(BaseGatewayEvents.GAME_OVER, () => {
      this.handleGameOver();
    });

    this.socket.on(BaseGatewayEvents.DISPLAY_TIMER, (data: any) => {
      if (this.component) {
        this.component.updateTimer(data.time);
      }
    });

    this.socket.on(RPSGameEvents.ROUND_RESULT, (data: any) => {
      this.zone.run(() => {
        if (!this.component) return;
        if (this.socket.id === data.playerA) {
          const isWinner = data.winner === 'PlayerA';
          const isLoser = data.winner === 'PlayerB';
          const isDraw = data.winner === 'Draw';
          this.component.setData({
            choice: data.playerAChoice,
            opponentChoice: data.playerBChoice,
            score: data.playerAWins,
            opponentScore: data.playerBWins,
            winner: isWinner,
            loser: isLoser,
            draw: isDraw,
            round: data.round,
          });
        } else {
          const isWinner = data.winner === 'PlayerB';
          const isLoser = data.winner === 'PlayerA';
          const isDraw = data.winner === 'Draw';
          this.component.setData({
            choice: data.playerBChoice,
            opponentChoice: data.playerAChoice,
            score: data.playerBWins,
            opponentScore: data.playerAWins,
            winner: isWinner,
            loser: isLoser,
            draw: isDraw,
            round: data.round,
          });
        }
      });
    });

    this.socket.on(RPSGameEvents.CHANGE_CHOICE, () => {});
  }

  public disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
  }

  public changeChoice(choice: RPSChoicesEnum): void {
    this.socket.volatile.emit(RPSGameEvents.CHANGE_CHOICE, {
      choice,
      clientId: this.socket.id,
      roomId: this.roomId,
    });
  }

  private playerDisconnected(playerId: string): void {}

  private handleGameOver(): void {
    this.zone.run(() => {
      if (this.component) {
        setTimeout(() => {
          this.component.showGameOverPopup();
        }, 1500);
      }
    });
  }
}

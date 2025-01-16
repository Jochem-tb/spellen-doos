import { Injectable, NgZone } from '@angular/core';
import { delay, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  BaseGatewayEvents,
  BingoCard,
  BingoGameEvents,
  BingoResultEnum,
} from '@spellen-doos/shared/api';
import { io, Socket } from 'socket.io-client';
import { GameServerService } from '../waitScreen/gameServer.service';
import { BingoComponent } from './bingo.component';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BingoService {
  zone: NgZone = new NgZone({ enableLongStackTrace: false });
  constructor(
    private gameServerService: GameServerService,
    private router: Router
  ) {
    console.log('[DEBUG] BingoService constructor');
    this.initializeSocketConnection();
    this.roomId = this.router.url.split('/')[2];
    console.log('[DEBUG] RoomId:', this.roomId);
  }

  private socket!: Socket;
  // private gameServer!: Socket;
  private roomId!: string;

  public component!: BingoComponent;

  private initializeSocketConnection(): void {
    console.log('[DEBUG] Initializing socket connection for BingoService');
    this.socket = this.gameServerService.getSocket();
    console.log(
      '[DEBUG] Retrieved socket from GameServerService:',
      this.socket
    );

    if (!this.socket.connected) {
      console.log('[DEBUG] Socket not connected. Attempting to reconnect...');
      this.socket.connect();
    }

    this.setupIncoming();

    console.log('[DEBUG] Requesting bingo card from server...');
    this.socket.emit(BingoGameEvents.BINGO_CARD, { roomId: this.roomId });
  }
  private setupIncoming(): void {
    console.log('[DEBUG] Setup incoming');

    this.socket.on(BaseGatewayEvents.PLAYER_DISCONNECT, (data: any) => {
      const playerId = data.playerId;
      if (playerId === this.socket.id) {
        console.log('You have been disconnected from the game');
      } else {
        this.playerDisconnected(playerId);
      }
    });

    this.socket.on(BaseGatewayEvents.GAME_OVER, (data: any) => {
      console.log('Game over');
      console.debug(data);
      this.handleGameOver();
    });

    this.socket.on(BingoGameEvents.BINGO_CARD, (card: BingoCard) => {
      console.log('Bingo card received from server');
      console.debug(card);
      this.component.updateBingoCard(card);
      console.log('Emitting player ready event...');
      this.socket.emit(BaseGatewayEvents.PLAYER_READY, { roomId: this.roomId });
    });

    this.socket.on(
      BingoGameEvents.BINGO_CALLED,
      (data: { clientId: string }) => {
        console.log('Bingo called by: ', data.clientId);
        if (this.socket.id && data.clientId !== this.socket.id) {
          this.handleBingoCalled(data.clientId);
        }
      }
    );

    this.socket.on(
      BingoGameEvents.BINGO_RESULT,
      (data: { clientId: string; result: BingoResultEnum }) => {
        console.log('Bingo result received from server for: ', data.clientId);
        this.handleBingoResult(data.clientId, data.result);
      }
    );

    this.socket.on(
      BingoGameEvents.NUMBER_CALLED,
      (data: { number: number; remaining: number }) => {
        console.log('Bingo number received: ', data.number);
        this.component.updateCalledNumber(data.number);
      }
    );
  }

  private handleBingoCalled(playerId: string): void {
    alert(`Speler ${playerId} heeft bingo geroepen`);
  }

  private handleBingoResult(playerId: string, result: BingoResultEnum): void {
    switch (result) {
      case BingoResultEnum.VALID:
        this.validBingo(playerId);
        break;
      case BingoResultEnum.NOT_VALID:
        this.invalidBingo(playerId);
        break;
      default:
        console.error('Something went wrong while handling BingoResult');
    }
  }

  private validBingo(playerId: string): void {
    alert(`Speler ${playerId} heeft geldige bingo!`);
  }

  private invalidBingo(playerId: string): void {
    alert(`Speler ${playerId} heeft ongeldige bingo!`);
  }

  private playerDisconnected(playerId: string): void {
    alert(`Speler ${playerId} heeft momenteel de game verlaten.`);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  private handleGameOver(): void {
    setTimeout(() => {
      alert('Game over');
      this.socket.disconnect();
      this.gameServerService.gameOver();
    }, 3000);
  }

  public callBingo(card: BingoCard): void {
    console.log(
      `[DEBUG - BingoService] Player: ${this.socket.id} called Bingo!`
    );
    this.socket.emit(BingoGameEvents.I_HAVE_BINGO, {
      playerCard: card,
      roomId: this.roomId,
    });
  }
}

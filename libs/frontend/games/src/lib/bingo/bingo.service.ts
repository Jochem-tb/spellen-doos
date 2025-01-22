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
      if (card) {
        this.component.updateBingoCard(card);
        console.log('Emitting player ready event...');
        this.socket.emit(BaseGatewayEvents.PLAYER_READY, {
          roomId: this.roomId,
        });
      } else {
        console.log('No bingo card received, requesting again...');
        this.socket.emit(BingoGameEvents.BINGO_CARD, { roomId: this.roomId });
      }
    });

    this.socket.on(
      BingoGameEvents.BINGO_CALLED,
      (data: { clientId: string }) => {
        console.log('Bingo called by: ', data.clientId);
        this.handleBingoCalled(data.clientId);
      }
    );

    this.socket.on(
      BingoGameEvents.BINGO_RESULT,
      (data: { clientId: string; result: BingoResultEnum }) => {
        console.log('Bingo result received from server for: ', data.clientId);
        setTimeout(() => {
          this.handleBingoResult(data.clientId, data.result);
        }, 3000);
      }
    );

    this.socket.on(
      BingoGameEvents.NUMBER_CALLED,
      (data: { number: number; remaining: number }) => {
        console.log('Bingo number received: ', data.number);
        this.component.updateCalledNumber(data.number);
      }
    );

    this.socket.on(BingoGameEvents.START_NUMBER_CALLING, (data: any) => {
      console.log('Number calling started event received');
      this.component.startNumberCalling();
    });
  }

  public getBingoCard(): void {
    console.log('[DEBUG] Requesting bingo card from server...');
    this.socket.emit(
      BingoGameEvents.BINGO_CARD,
      { roomId: this.roomId },
      () => {
        console.log('Bingo card requested');
      }
    );

    this.socket.on(
      BingoGameEvents.NUMBER_CALLED,
      (data: { number: number; remaining: number }) => {
        console.log('Bingo number received: ', data.number);
        this.component.updateCalledNumber(data.number);
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
    this.component.displayBingoPicture(true);
    this.component.toggleBingoButton();
    setTimeout(() => {
      this.component.displayBingoPicture(false);
      setTimeout(() => {
        this.component.toggleBingoButton();
      }, 1500);
    }, 5000);
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
    let message;

    if (playerId === this.socket.id) {
      message = 'Je hebt geldige bingo!';
    } else {
      message = `Een andere speler heeft geldige bingo!`;
    }

    this.component.bingoMessage = message;
    this.component.displayBingoMessage = true;
    this.component.successBingo = true;
  }

  private invalidBingo(playerId: string): void {
    if (playerId === this.socket.id) {
      // alert(`Je hebt ongeldige bingo!`);
    }
    this.component.successBingo = false;
  }

  private playerDisconnected(playerId: string): void {
    if (this.socket.id === playerId) {
      alert('Er is een fout opgetreden. Je bent uit de game gezet.');
      this.router.navigate(['/']);
    }
    alert(`Speler ${playerId} heeft momenteel de game verlaten.`);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  private handleGameOver(): void {
    this.socket.disconnect();
    this.gameServerService.gameOver();
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

import { Injectable, NgZone } from '@angular/core';
import { delay, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseGatewayEvents, BingoGameEvents } from '@spellen-doos/shared/api';
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

  public callBingo(clientId: string): void {
    console.log(`[DEBUG - BingoService] Player: ${clientId} called Bingo!`);
    this.socket.emit(BingoGameEvents.I_HAVE_BINGO, {
      clientId: this.socket.id,
      roomId: this.roomId,
    });
  }
}

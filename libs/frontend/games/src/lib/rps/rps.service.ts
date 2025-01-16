import { Injectable, NgZone } from '@angular/core';
import { delay, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  BaseGatewayEvents,
  IUser,
  ProfilePictureEnum,
  RPSChoicesEnum,
  RPSGameEvents,
  UserRole,
} from '@spellen-doos/shared/api';
import { io, Socket } from 'socket.io-client';
import { GameServerService } from '../waitScreen/gameServer.service';
import { RpsComponent } from './rps.component';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RPSService {
  zone: NgZone = new NgZone({ enableLongStackTrace: false });
  constructor(
    private gameServerService: GameServerService,
    private router: Router
  ) {
    console.log('[DEBUG] RPSService constructor');
    this.initializeSocketConnection();
    this.roomId = this.router.url.split('/')[2];
    console.log('[DEBUG] RoomId:', this.roomId);
  }

  private socket!: Socket;
  // private gameServer!: Socket;
  private roomId!: string;

  public component!: RpsComponent;

  private initializeSocketConnection(): void {
    console.log('[DEBUG] Initializing socket connection');
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

    this.socket.on(BaseGatewayEvents.DISPLAY_TIMER, (data: any) => {
      console.log('Timer updated:', data.time);
      this.component.updateTimer(data.time);
    });

    this.socket.on(RPSGameEvents.ROUND_RESULT, (data: any) => {
      console.log('[DEBUG] ROUND_RESULT event binnen:', data);
  
      // Zorg ervoor dat Angular de UI bijwerkt
      this.zone.run(() => {
        if (!this.component) {
          console.warn('[WARNING] Component is niet gekoppeld aan service!');
          return;
        }
  
        // Update data in de component
        if (this.socket.id === data.playerA) {
          this.component.setData({
            choice: data.playerAChoice,
            opponentChoice: data.playerBChoice,
            score: data.playerAWins,
            opponentScore: data.playerBWins,
            winner: data.winner === 'PlayerA',
            looser: data.winner === 'PlayerB',
            round: data.round
          });
        } else {
          this.component.setData({
            choice: data.playerBChoice,
            opponentChoice: data.playerAChoice,
            score: data.playerBWins,
            opponentScore: data.playerAWins,
            winner: data.winner === 'PlayerB',
            looser: data.winner === 'PlayerA',
            round: data.round
          });
        }
      });
    });
    
    this.socket.on(RPSGameEvents.CHANGE_CHOICE, (data: any) => {
      console.log('My choice in gameController:', data.choice);
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
      alert('Het spel is voorbij!\nBedankt voor het spelen!\nJe wordt nu teruggestuurd naar het dashboard.');
      this.socket.disconnect();
      this.gameServerService.gameOver();
    }, 3000);
  }

  public changeChoice(choice: RPSChoicesEnum): void {
    console.log(`[DEBUG - RPSService] Player choice: ${choice}`);
    this.socket.volatile.emit(RPSGameEvents.CHANGE_CHOICE, {
      choice,
      clientId: this.socket.id,
      roomId: this.roomId,
    });
  }
}

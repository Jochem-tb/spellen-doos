import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class RPSService {
  constructor(private gameServerService: GameServerService) {
    console.log('[DEBUG] RPSService constructor');
    this.initializeSocketConnection();
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

    this.socket.on(BaseGatewayEvents.START_GAME, (roomId: any) => {
      console.log('Game started');
      console.log('RoomId:', roomId);
      this.roomId = roomId;
    });

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
      console.log('Round Results:', data);
      alert(`Round results: ${data}`);
    });
  }

  private playerDisconnected(playerId: string): void {
    alert(`Speler ${playerId} heeft momenteel de game verlaten.`);
  }

  private handleGameOver(): void {
    alert('Game over');
    this.gameServerService.gameOver();
  }

  public changeChoice(choice: RPSChoicesEnum): void {
    console.log(`[DEBUG - RPSService] Player choice: ${choice}`);
    this.socket.volatile.emit(
      RPSGameEvents.CHANGE_CHOICE,
      {
        choice,
        clientId: this.socket.id,
        roomId: this.roomId,
      },
      (success: boolean) => {
        if (success) {
          console.log('Choice successfully changed');
        } else {
          console.log('Failed to change choice');
        }
      }
    );
  }
}

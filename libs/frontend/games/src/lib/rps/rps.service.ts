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

@Injectable({
  providedIn: 'root',
})
export class RPSService {
  constructor(private gameServerService: GameServerService) {
    console.log('[DEBUG] RPSService constructor');
    this.retrieveConnection();
    console.log('RPSService constructed');
    console.log('Socket:', this.socket);
  }

  private socket!: Socket;
  private gameServer!: Socket;

  private retrieveConnection(): void {
    console.log('[DEBUG] Retrieve connection');
    this.socket = this.gameServerService.getSocket();
    console.log('[DEBUG] got socket:', this.socket);
    if (!this.socket.connected) {
      console.log('Socket not connected, attempting to reconnect');
    }
    this.connectToGameServer();
  }

  private connectToGameServer(): void {
    console.log('[DEBUG] connectToGameServer()');
    const gameID = window.location.pathname.split('/').pop();
    console.log('GameID:', gameID);
    this.gameServer = io(`http://localhost:3000/${gameID}`, {
      query: { gameId: gameID }, // Send the gameId as a query parameter
    });
    this.gameServer.on(BaseGatewayEvents.CONNECT, () => {
      console.log('[DEBUG] GameServer connected:', this.gameServer.id);
      this.setupIncoming();
    });

    this.gameServer.on('connect_error', (err) => {
      console.error('[ERROR] GameServer connection error:', err);
    });

    this.gameServer.on('connect_timeout', () => {
      console.log('[DEBUG] GameServer connection timeout');
    });

    this.gameServer.connect();
    // this.gameServer.connect();
    // this.connectToGameServer();
  }

  private setupIncoming(): void {
    console.log('[DEBUG] Setup incoming');
    this.socket.on(BaseGatewayEvents.START_GAME, (gameID: any) => {
      console.log('Game started');
      console.log('GameId:', gameID);

      this.socket.emit(RPSGameEvents.CHANGE_CHOICE, RPSChoicesEnum.Steen);
    });
  }

  public changeChoice(choice: RPSChoicesEnum): void {
    console.log(`[DEBUG - RPSService] Player choice: ${choice}`);
    console.log('GameServer:', this.gameServer);
    console.log('Socket:', RPSGameEvents.CHANGE_CHOICE, choice);
    if (this.gameServer.connected) {
      this.gameServer.emit(RPSGameEvents.CHANGE_CHOICE, {
        choice,
        clientId: this.socket.id,
      });
    } else {
      console.log(
        '[DEBUG - changeChoice method] GameServer not connected, attempting to reconnect'
      );
      this.gameServer.connect();
      this.gameServer.once('connect', () => {
        this.gameServer.emit(RPSGameEvents.CHANGE_CHOICE, {
          choice,
          clientId: this.socket.id,
        });
      });
    }
  }
}

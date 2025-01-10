import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  BaseGatewayEvents,
  IUser,
  ProfilePictureEnum,
  UserRole,
} from '@spellen-doos/shared/api';
import { io } from 'socket.io-client';
import { GameServerService } from '../waitScreen/gameServer.service';

@Injectable({
  providedIn: 'root',
})
export class RPSService {
  constructor(private gameServerService: GameServerService) {
    this.retrieveConnection();
    console.log('RPSService constructed');
    console.log('Socket:', this.socket);
  }

  private socket: any;

  private retrieveConnection(): void {
    this.socket = this.gameServerService.getSocket();
    if (!this.socket.connected) {
      console.log('Socket not connected, attempting to reconnect');
    }
  }

  private setupIncoming(): void {}

  private setupOutgoing(): void {}
}

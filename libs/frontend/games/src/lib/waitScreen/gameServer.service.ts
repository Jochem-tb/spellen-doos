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

@Injectable({
  providedIn: 'root',
})
export class RPSGameServerController {
  constructor() {}

  //TESTING SOCKETS

  private socket: any;
  private NUM_PLAYER_QUEUE: number = -1;

  public signIntoQueue(title: string): boolean {
    try {
      this.initializeSocket(title);
      this.verifyConnection();
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
    return true;
  }

  public signOutOfQueue(): boolean {
    try {
      this.notifyServerOfLeave();
    } catch (error) {
      return false;
    }
    this.socket.disconnect();
    return true;
  }

  public getNumberOfPlayersInQueue(): Observable<number> {
    return new Observable<number>((observer) => {
      this.socket.emit(
        BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE,
        this.socket.id
      );
      this.socket.on(BaseGatewayEvents.CHECK_NUM_PLAYER_QUEUE, (data: any) => {
        this.NUM_PLAYER_QUEUE = data;
        observer.next(this.NUM_PLAYER_QUEUE);
        observer.complete();
      });
    });
  }

  notifyServerOfLeave() {
    // throw new Error('Method not implemented.');
  }

  private verifyConnection() {
    // throw new Error('Method not implemented.');
  }

  private initializeSocket(gameTitle: string): void {
    //Choose right GameServer
    console.debug('GameTitle:', gameTitle);
    switch (gameTitle) {
      case 'Steen Papier Schaar':
        this.socket = io(
          'http://localhost:3000/RPSGameServerControllerGateway'
        );
        break;
      //Add other gae cases here
      default:
        '';
    }

    if (!this.socket.connected) {
      throw new Error('Socket initialization failed');
    }

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('connect', () => {
      console.log('Connected to the control hub:', this.socket.id);

      // Send a message
      this.socket.emit('message', {
        userId: '12345',
        message: 'Hello, server!',
      });

      this.socket.emit('changeChoice', { data: 'Hello, server!' });

      // Listen for responses
      this.socket.on('response', (data: any) => {
        console.log('Server response:', data);
      });
    });

    // Handle disconnection
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the control hub');
    });
  }
}

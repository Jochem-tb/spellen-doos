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
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GameServerService {
  constructor(private router: Router) {}

  //TESTING SOCKETS

  public getSocket(): any {
    return this.socket;
  }

  protected socket: any;
  private NUM_PLAYER_QUEUE: number = -1;

  public gameOver(): void {
    this.router.navigate(['/dashboard']);
  }

  public signIntoQueue(title: string): boolean {
    try {
      this.initializeSocket(title);
    } catch (error) {
      console.log('Error:', error);
      return false;
    }
    return true;
  }

  public signOutOfQueue(): boolean {
    try {
    } catch (error) {
      return false;
    }
    // if (window.location.pathname !== '/rpsGame/:id') {
    //   console.log('Disconnecting from server');
    //   this.socket.disconnect();
    // }
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

    this.socket.on(BaseGatewayEvents.CONNECT, () => {
      console.log('Connected to server');
      console.log('Connected to the control hub:', this.socket.id);
    });

    this.socket.on(BaseGatewayEvents.START_GAME, (gameId: any) => {
      console.log('Game started:', gameId);
      this.router.navigate([`/rpsGame/${gameId}`]);
    });

    // Handle disconnection
    this.socket.on(BaseGatewayEvents.DISCONNECT, () => {
      console.log('Disconnected from the control hub');
    });
  }
}

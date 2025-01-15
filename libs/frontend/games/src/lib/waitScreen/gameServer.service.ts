import { Injectable } from '@angular/core';
import { delay, interval, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  BaseGatewayEvents,
  IUser,
  ProfilePictureEnum,
  UserRole,
} from '@spellen-doos/shared/api';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';
import { WaitScreenComponent } from './waitScreen.component';

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
  public waitScreenComponent!: WaitScreenComponent;

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
    if (this.socket && this.socket.connected) {
      console.log('Socket already exists and is connected.');
      return;
    }

    //Choose right GameServer
    console.debug('GameTitle:', gameTitle);
    switch (gameTitle) {
      case 'Steen Papier Schaar':
        this.socket = io(
          'http://192.168.2.18:3000/RPSGameServerControllerGateway'
        );
        break;
      //Add other game cases here
      default:
        '';
    }

    this.socket.on(BaseGatewayEvents.CONNECT, () => {
      console.log('Connected to server');
      console.log('[DEBUG] Socket ID:', this.socket.id);
    });

    this.socket.on(BaseGatewayEvents.SETUP_GAME, (gameId: any) => {
      console.log('Game start event received for game:', gameId);
      this.waitScreenComponent.stopTimer();
      this.waitScreenComponent.displayGameFound = true;
      this.waitScreenComponent.gameFoundMessage = 'Tegenstander(s) gevonden!';
      of(null)
        // Wait for 1.5 seconds before proceeding --> only display gameFoundMessage
        .pipe(delay(1500))
        .subscribe(() => {
          let countdown = 3;
          const countdownInterval = interval(1000).subscribe(() => {
            if (countdown >= 0) {
              console.log('Countdown:', countdown);
              this.waitScreenComponent.gameFoundTimer = countdown;
              countdown--;
            } else {
              countdownInterval.unsubscribe();
              this.waitScreenComponent.displayGameFound = false;
              this.router.navigate([`/rpsGame/${gameId}`]);
            }
          });
        });
    });

    // Handle disconnection
    this.socket.on(BaseGatewayEvents.DISCONNECT, () => {
      console.log('Disconnected from the control hub');
    });
  }
}

import { Injectable } from '@angular/core';
import { delay, interval, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  BaseGatewayEvents,
  IGame,
  IUser,
  ProfilePictureEnum,
  UserRole,
} from '@spellen-doos/shared/api';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';
import { WaitScreenComponent } from './waitScreen.component';
import { environment } from '@spellen-doos/environment';

export enum WaitScreenGames {
  RPS = 'Steen papier schaar',
  BINGO = 'Bingo!!',
}

@Injectable({
  providedIn: 'root',
})
export class GameServerService {
  constructor(private router: Router, private http: HttpClient) {}

  //TESTING SOCKETS

  public getSocket(): any {
    return this.socket;
  }

  protected socket: any;
  private NUM_PLAYER_QUEUE: number = -1;
  private waitScreenGame!: WaitScreenGames;
  public waitScreenComponent!: WaitScreenComponent;

  public getGameTitle(id: string): Observable<string> {
    return this.http
      .get<{ results: IGame }>(`${environment.dataApiUrl}/game/` + id)
      .pipe(map((response) => response.results.name));
  }

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
    console.log('[DEBUG] initializeSocket()');
    if (this.socket && this.socket.connected) {
      console.log('Socket already exists and is connected.');
      return;
    }

    //Choose right GameServer
    console.debug('GameTitle in gameServer.Service:', gameTitle);
    switch (gameTitle) {
      case WaitScreenGames.RPS:
        this.waitScreenGame = WaitScreenGames.RPS;
        this.socket = io(
          `${environment.socketUrl}/RPSGameServerControllerGateway`
        );
        break;
      case WaitScreenGames.BINGO:
        this.waitScreenGame = WaitScreenGames.BINGO;
        this.socket = io(
          `${environment.socketUrl}/BingoGameServerControllerGateway`
        );
        break;

      //Add other game cases here
      default:
        console.error('Game not found');
        throw new Error('Game not found');
        return;
    }

    this.socket.on(BaseGatewayEvents.CONNECT, () => {
      console.log('Connected to server');
      console.log('[DEBUG] Socket ID:', this.socket.id);
    });

    this.socket.on(BaseGatewayEvents.SETUP_GAME, (gameId: any) => {
      console.log('Game start event received for game:', gameId);

      let gameFoundMessage = '';
      let gameUrl = '';

      switch (this.waitScreenGame) {
        case WaitScreenGames.RPS:
          gameFoundMessage = 'Tegenstander(s) gevonden!';
          gameUrl = `/rpsGame/${gameId}`;
          break;
        case WaitScreenGames.BINGO:
          gameFoundMessage = 'Medespelers gevonden!';
          gameUrl = `/bingoGame/${gameId}`;
          break;
      }

      this.waitScreenComponent.stopTimer();
      this.waitScreenComponent.displayGameFound = true;
      this.waitScreenComponent.gameFoundMessage = gameFoundMessage;
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
              if (gameUrl !== '') {
                this.router.navigate([gameUrl]);
              } else {
                console.error('GameUrl not found');
                this.router.navigate(['/dashboard']);
              }
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

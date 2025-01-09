import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser, ProfilePictureEnum, UserRole } from '@spellen-doos/shared/api';
import { io } from 'socket.io-client';
import { GameServerService } from './gameServer.service';

@Injectable({
  providedIn: 'root',
})
export class WaitScreenService {
  private loggedUser: IUser | null = null;
  private NUM_PLAYER_QUEUE: number = 2;

  constructor(private gameServerService: GameServerService) {
    console.log('Service constructor aanroepen');
  }

  signIntoQueue(title: string): Observable<boolean> {
    console.log('Service signIntoQueue aanroepen');
    return of(this.gameServerService.signIntoQueue(title));
  }

  signOutOfQueue(): Observable<boolean> {
    console.log('Service signOutOfQueue aanroepen');
    return of(this.gameServerService.signOutOfQueue());
  }

  getNumberOfPlayersInQueue(): Observable<number> {
    console.log('Service getNumberOfPlayersInQueue aanroepen');
    return of(this.NUM_PLAYER_QUEUE).pipe(delay(300));
  }
}

import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser, ProfilePictureEnum, UserRole } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class WaitScreenService {
  private loggedUser: IUser | null = null;
  private NUM_PLAYER_QUEUE: number = 2;

  constructor() {
    console.log('Service constructor aanroepen');
  }

  signIntoQueue(): Observable<boolean> {
    //TODO: Implement real call
    console.log('Service signIntoQueue aanroepen');
    return of(true).pipe(delay(3000));
  }

  signOutOfQueue(): Observable<boolean> {
    console.log('Service signOutOfQueue aanroepen');
    return of(true).pipe(delay(300));
  }

  getNumberOfPlayersInQueue(): Observable<number> {
    console.log('Service getNumberOfPlayersInQueue aanroepen');
    return of(this.NUM_PLAYER_QUEUE).pipe(delay(300));
  }
}

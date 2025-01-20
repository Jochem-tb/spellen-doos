import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IGame } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  private games: IGame[] = [];

  constructor(private http: HttpClient) {
    console.log('Service constructor aanroepen');
  }

  getGamesApi(): Observable<IGame[]> {
    return this.http
      .get<{ results: IGame[] }>('http://localhost:3000/api/game')
      .pipe(map((response) => response.results));
  }
}

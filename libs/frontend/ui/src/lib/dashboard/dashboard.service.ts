import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IGame } from '@spellen-doos/shared/api';
import { environment } from '@spellen-doos/environment';

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
      .get<{ results: IGame[] }>(`${environment.dataApiUrl}/game`)
      .pipe(map((response) => response.results));
  }

}

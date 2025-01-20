import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IGame, IHelpButton } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class GameTutorialService {
    constructor(private http: HttpClient) {}
    
  getGameContent(gameId: string) : Observable<IGame> {
    return this.http
      .get<{ results: IGame }>('http://localhost:3000/api/game/' + gameId)
      .pipe(map((response) => response.results));
  }
}
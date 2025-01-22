import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IGame} from '@spellen-doos/shared/api';
import { environment } from '@spellen-doos/environment';

@Injectable({
  providedIn: 'root',
})
export class GameTutorialService {
    constructor(private http: HttpClient) {}
    
  getGameContent(gameId: string) : Observable<IGame> {
    return this.http
      .get<{ results: IGame }>(`${environment.dataApiUrl}/game/${gameId}`)
      .pipe(map((response) => response.results));
  }
}
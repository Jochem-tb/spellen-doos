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

  getHelpContentMock(route: string): Observable<string> {
    console.log('mock aangeroepen');
    return new Observable<string>((observer) => {
      observer.next(`
                Steen, Papier, Schaar is een klassiek spel dat gespeeld wordt met twee spelers. Beide spelers kiezen tegelijkertijd een van de drie opties: steen, papier of schaar. 
                <br><br>
                De regels gaan als volgt:
                <br>
                - Steen verslaat schaar (steen breekt schaar).
                <br>
                - Schaar verslaat papier (schaar knipt papier).
                <br>
                - Papier verslaat steen (papier bedekt steen).
                <br><br>
                Het doel is om je tegenstander te verslaan door een optie te kiezen die hun keuze verslaat.
        `);
      observer.complete();
    });
  }
}
import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IGame } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  private games: IGame[] = [];

  constructor() {
    console.log('Service constructor aanroepen');
  }

  getGames(): Observable<IGame[]> {
    console.debug('Service getGames aanroepen');
    if (this.games.length > 0) {
      return of(this.games);
    }

    // Mocking the real call
    const mockGames: IGame[] = [
      {
        name: 'Steen papier schaar  ',
        shortDescription: 'Dit spelletje kent iedereen natuulrijk',
        cardImage:
          'https://images.bonnier.cloud/files/his/production/2020/03/09155140/stensakspapirtop.jpg',
      },
      {
        name: 'Bingo!!',
        shortDescription: 'Wie kent het niet, bingo!',
        cardImage:
          'https://play-lh.googleusercontent.com/AGR1f-ipIP44j8vdb7BZwkHUGFkEYAh9AE-ncEyFniYlY0153n_IFoCJ4SN4K5oHrw',
      },
      {
        name: 'Memory',
        shortDescription: 'Een spelletje voor jong en oud',
        cardImage:
          'https://www.bakerross.co.uk/craft-ideas/wp-content/uploads/2022/06/K485.jpg',
      },
    ];

    return of(mockGames).pipe(
      map((games) => {
        this.games = games;
        return games;
      }),
      delay(1000)
    );
  }
}

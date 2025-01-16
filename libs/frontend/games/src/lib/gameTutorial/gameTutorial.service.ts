import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IHelpButton } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class GameTutorialService {
    private apiUrl = 'http://localhost:3000/api/helpButton';

    constructor(private http: HttpClient) {}
    
  getHelpContent(route: string): Observable<IHelpButton> {
    return this.http
      .get<{ results: IHelpButton }>(
        `${this.apiUrl}?route=${encodeURIComponent(route)}`
      )
      .pipe(
        map((response) => {
          if (!response.results) {
            throw new Error('No content found for the specified route');
          }
          return response.results;
        })
      );
  }

  getHelpContentMock(route: string): Observable<string> {
    console.log('mock aangeroepen');
    return new Observable<string>((observer) => {
      observer.next(`
        <h1>Welcome to the Help Section</h1>
        `);
      observer.complete();
    });
  }
}
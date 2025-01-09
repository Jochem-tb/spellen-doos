import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IUser } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private loggedUser: IUser | null = null;

  constructor(private http: HttpClient) {
    console.log('Service constructor called');
  }

  getProfileById(id: string): Observable<IUser> {
    console.log('getUserById called');
    if (this.loggedUser != null) { // Checks if person is already loggedIn
      console.log('Returning cached user');
      return of(this.loggedUser);
    }
  
    return this.http.get<{ results: IUser }>('http://localhost:3000' + `/api/user/${id}`).pipe(
      map((response) => {
        console.log('Response received:', response);
        this.loggedUser = response.results; // Save the response as loggedUser
        return response.results;
      })
    );
  }

  updateProfile(id: string, user: IUser): Observable<IUser> {
    console.log('updateProfile called');

    const request = this.http
      .put<{ results: any }>('http://localhost:3000' + `/api/user/${id}`, user)
      .pipe(
        map((response) => { // Succesfull response
          console.log('API response:', response);
          return response.results;
        }),
        catchError((error) => { // Error handling
          console.error('API error:', error);
          throw error;
        })
      );

    request.subscribe( // For some reason the request is not executed without this subscribe
      (data) => console.log('Request successful:', data),
      (error) => console.error('Request failed:', error)
    );

    return request;
  }
}
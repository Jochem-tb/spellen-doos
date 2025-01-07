import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser, ProfilePictureEnum, UserRole } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private loggedUser: IUser | null = null;

  constructor(private http: HttpClient) {
    console.log('Service constructor aanroepen');
  }

  getProfile(): Observable<IUser> {
    console.log('Service getProfile aanroepen');
    if (this.loggedUser != null) {
      console.log('Returning cached user');
      return of(this.loggedUser);
    }

    // Mocking the real call
    const mockProfile: IUser = {
      userName: 'John',
      email: 'myOwnEmail',
      dateOfBirth: new Date("1973-03-20"),
      password: 'abc',
      role: UserRole.User,
      profilePicture: ProfilePictureEnum.Pic1,
    };

    console.log('Returning mock user');
    return of(mockProfile).pipe(
      map((profile) => {
        this.loggedUser = profile;
        return profile;
      }),
      delay(300)
    );
  }

  getProfileById(id: string): Observable<IUser> {
    console.log('getUserById aanroepen');
    return this.http.get<{ results: IUser }>('http://localhost:3000' + `/api/user/${id}`).pipe(
      map((response) => {
        console.log('Response received:', response);
        return response.results;
      })
    );
  }

  updateProfile(id: string, user: IUser): Observable<IUser> {
    console.log('updateProfile aanroepen :', user);
    return this.http.put<{ results: IUser }>('http://localhost:3000' + `/api/user/${id}`, user).pipe(
      map((response) => {
        console.log('Response received:', response);
        return response.results;
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser, ProfilePictureEnum, UserRole } from '@spellen-doos/shared/api';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private loggedUser: IUser | null = null;

  constructor() {
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
      firstName: 'John',
      // email: 'myOwnEmail',
      dateOfBirth: new Date(),
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
}

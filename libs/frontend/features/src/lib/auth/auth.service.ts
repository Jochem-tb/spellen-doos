import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../../../../../backend/user/src';
import { IUser, IUserIdentity, ProfilePictureEnum } from '../../../../../shared/api/src';
import { Router } from '@angular/router';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateUserDto } from '../../../../../backend/dto/src';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<IUserIdentity | null>(null);
  private readonly CURRENT_USER = 'currentuser';
  private readonly TOKEN_KEY = 'token';


  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load the user from localStorage on service initialization
    this.getUserFromLocalStorage()
      .pipe(
        switchMap((user: User | null) => {
          if (user) {
            console.log('User found in localStorage.');
            this.currentUser$.next(user);
            return this.validateToken();
          } else {
            console.log('No user found in localStorage.');
            return of(null);
          }
        })
      )
      .subscribe(() => console.log('Startup authentication completed.'));
  }

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  login(userName: string, password: string): Observable<IUserIdentity | null> {
    console.log(`login at http://localhost:3000/api/auth/login`);
  
    return this.http
      .post<{ results: { _id: string; token: string; userName: string; profileImgUrl: string } }>(
        `http://localhost:3000/api/auth/login`,
        { userName, password },
        { headers: this.headers }
      )
      .pipe(
        map((response) => {
          console.log('API Response:', response);
          const { token, userName } = response.results;
  
          if (!token || !userName) {
            throw new Error('Token or user details missing from response');
          }
  
          const user: IUserIdentity = {
            userName: userName,
            token: token,
          };
  
          this.saveUserToLocalStorage(user, token);
          this.currentUser$.next(user);
          return user;
        }),
        catchError((error: any) => {
          console.error('Login failed:', error);
          return of(null);
        })
      );
  }
  

  register(dto: CreateUserDto): Observable<User | null> {
    return this.http
      .post<{ results: User & { token: string } }>(
        `http://localhost:3000/api/auth/register`,
        dto
      )
      .pipe(
        map((response) => {
          const { results } = response;
          const { ...user } = results;
  
          console.log('User:', user);
  
          // Update the current user
          this.currentUser$.next(user as User);
  
          console.log('Registration successful:', user);
          return user as User;
        }),
        catchError((error: any) => {
          console.error('Registration error:', error);
  
          // Pass null back to the caller to indicate failure
          return of(null);
        })
      );
  }
  
// validateToken() tijdelijk
validateToken() {
    console.log('Validate token aangeroepen');
    return of(null);
}

//   validateToken(): Observable<User | null> {
//     const token = localStorage.getItem(this.TOKEN_KEY);
//     if (!token) {
//       this.logout();
//       return of(null);
//     }

//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       }),
//     };

//     return this.http.get<User>(`http://localhost:3000/api/auth/profile`, httpOptions).pipe(
//       tap((validatedUser) => {
//         console.log('Token is valid.');
//         this.currentUser$.next(validatedUser);
//       }),
//       catchError((error) => {
//         console.error('Token validation failed:', error);
//         this.logout();
//         return of(null);
//       })
//     );
//   }

  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem(this.CURRENT_USER);
    localStorage.removeItem(this.TOKEN_KEY);
    
    this.currentUser$.next(null);
    
    this.router.navigate(['/login']).then((success) => {
      if (success) {
        console.log('Logged out successfully.');
      } else {
        console.error('Logout navigation failed.');
      }
    });
  }

  getUserFromLocalStorage(): Observable<User | null> {
    const userJson = localStorage.getItem(this.CURRENT_USER);
    if (!userJson) {
        return of(null);
    }
    try {
        const user: IUser = JSON.parse(userJson);
        const mappedUser: User = {
            ...user,
            profilePicture: ProfilePictureEnum.Pic1,
            token: localStorage.getItem(this.TOKEN_KEY) || '',
        };
        return of(mappedUser);
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return of(null);
    }
  }

  saveUserToLocalStorage(user: IUserIdentity, token: string): void {
    if (!user || !token) {
      console.error('User or token is undefined');
      return;
    }
  
    console.log('Saving user to localStorage:', user);
    localStorage.setItem('currentuser', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
}
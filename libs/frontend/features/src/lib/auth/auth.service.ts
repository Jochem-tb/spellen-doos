import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../../../../../backend/user/src';
import { IUser, IUserIdentity, ProfilePictureEnum } from '../../../../../shared/api/src';
import { Router } from '@angular/router';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateUserDto } from '../../../../../backend/dto/src';
import * as bcrypt from 'bcryptjs';
import { environment } from '@spellen-doos/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<IUserIdentity | null>(null);
  private readonly CURRENT_USER = 'currentuser';
  private readonly TOKEN_KEY = 'token';
  httpService: any;

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

  checkUserNameExistence(userName: string): Observable<any> {
    console.log(`Checking username existence at /api/user/check-username/${userName}`);
    return this.http
      .get<{ results: { exists: boolean } }>(`${environment.dataApiUrl}/user/check-username/${userName}`)
      .pipe(map((response) => response.results.exists));
  }

  async login(userName: string, password: string): Promise<Observable<IUserIdentity | null>> {
    console.log(`login at ${environment.dataApiUrl}/auth/login`);
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.http
      .post<{ results: { _id: string; token: string; userName: string; profileImgUrl: string } }>(
        `${environment.dataApiUrl}/auth/login`,
        { userName, password: hashedPassword },
        { headers: this.headers }
      )
      .pipe(
        map((response) => {
          console.log('API Response:', response);
          const { _id, token, userName } = response.results;

          if (!token || !userName || !_id) {
            throw new Error('Token, user details, or user ID missing from response');
          }

          const user: IUserIdentity = {
            userName: userName
          };

          this.saveUserToLocalStorage(user, token);
          this.saveUserIdToLocalStorage(_id, token);
          this.currentUser$.next(user);
          return user;
        }),
        catchError((error: any) => {
          console.error('Login failed:', error);
          return of(null);
        })
      );
  }

  async register(dto: CreateUserDto): Promise<Observable<User | null>> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const registerDto = { ...dto, password: hashedPassword };

    return this.http
      .post<{ results: User & { token: string } }>(
        `${environment.dataApiUrl}/auth/register`,
        registerDto
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

  saveUserIdToLocalStorage(userId: string, token: string): void {
    if (!userId || !token) {
      console.error('User ID or token is undefined');
      return;
    }

    console.log('Saving user ID to localStorage:', userId);
    localStorage.setItem('userId', userId); // Save userId to localStorage
  }
}
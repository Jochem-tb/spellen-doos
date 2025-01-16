import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { ProfileService } from '../../profile/profile.service';
import { IUser } from '@spellen-doos/shared/api';
import { AuthService } from '@spellen-doos/features';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  public profile: IUser | null = null;
  private userId: string | null = null;
  logoutShown = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    console.log('Retrieved userId from localStorage:', this.userId);

    if (this.userId) {
      this.profileService.getProfileById(this.userId).subscribe((profile) => {
        this.profile = profile;
      });
    } else {
      console.error('User ID is null');
    }

    this.router.events.subscribe(() => {
      const currentRoute = this.router.url.split('/').pop();
      console.log('[DEBUG] Current route:', currentRoute);
      this.logoutShown = currentRoute === 'dashboard';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
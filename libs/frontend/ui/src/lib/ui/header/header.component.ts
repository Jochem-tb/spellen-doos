import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { IUser } from '@spellen-doos/shared/api';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  public profile: IUser | null = null;
  private userId: string = '677d0b6ccc31fe87a70d8190'; // Dummy ID
  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfileById(this.userId).subscribe((profile) => {
      this.profile = profile;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser, ProfilePictureEnum } from '@spellen-doos/shared/api';
import { ProfileService } from './profile.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit {
  profile: IUser | null = null;
  editableFields = [
    {
      label: 'Naam',
      value: this.profile?.firstName,
      type: 'text',
      isEditing: false,
    },
    {
      label: 'Email-adres',
      value: this.profile?.email,
      type: 'text',
      isEditing: false,
    },
    {
      label: 'Geboortedatum',
      value: this.formatDate(this.profile?.dateOfBirth),
      type: 'date',
      isEditing: false,
    },
    { label: 'Wachtwoord', value: '', type: 'password', isEditing: false },
  ];

  constructor(private profileService: ProfileService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    console.log('ProfileComponent ngOnInit');
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.initializeFields();
    });
  }

  profilePictureOptions = Object.values(ProfilePictureEnum);

  // Flag to toggle showing the picture options
  showPictureOptions: boolean = false;

  // Method to toggle showing the profile picture options
  togglePictureOptions(): void {
    this.showPictureOptions = !this.showPictureOptions;
  }

  // Method to select a profile picture
  selectProfilePicture(picture: ProfilePictureEnum): void {
    if (this.profile) {
      this.profile.profilePicture = picture; // Set the new profile picture
    }
    this.showPictureOptions = false; // Close the options
  }

  initializeFields() {
    console.log('ProfileComponent initializeFields');
    this.editableFields = [
      {
        label: 'Naam',
        value: this.profile?.firstName,
        type: 'text',
        isEditing: false,
      },
      {
        label: 'Email-adres',
        value: this.profile?.email,
        type: 'text',
        isEditing: false,
      },
      {
        label: 'Geboortedatum',
        value: this.formatDate(this.profile?.dateOfBirth),
        type: 'date',
        isEditing: false,
      },
      {
        label: 'Wachtwoord',
        value: '*********',
        type: 'password',
        isEditing: false,
      },
    ];
  }

  formatDate(date: Date | undefined): string {
    return date ? this.datePipe.transform(date, 'dd-MM-yyyy') || '' : '';
  }

  startEditing(field: any) {
    field.isEditing = true;
  }

  stopEditing(field: any) {
    if (field.type === 'date') {
      field.value = this.formatDate(new Date(field.value));
    }
    field.isEditing = false;
  }
}
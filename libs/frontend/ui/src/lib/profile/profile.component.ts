import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '@spellen-doos/shared/api';
import { ProfileService } from './profile.service';

@Component({
  selector: 'lib-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
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
      value: this.profile?.dateOfBirth,
      type: 'date',
      isEditing: false,
    },
    { label: 'Wachtwoord', value: '', type: 'password', isEditing: false },
  ];

  startEditing(field: any) {
    field.isEditing = true;
  }

  stopEditing(field: any) {
    field.isEditing = false;
  }

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    console.log('ProfileComponent ngOnInit');
    this.profileService.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.initializeFields();
    });
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
        value: this.profile?.dateOfBirth,
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
}

import { Component, OnInit } from '@angular/core';
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
  editableFields = [ // Loading screen
    {
      label: 'Naam',
      type: 'text',
      isEditing: false,
    },
    // {
    //   label: 'Email-adres',
    //   type: 'text',
    //   isEditing: false,
    // },
    {
      label: 'Geboortedatum',
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
        type: 'email', // type = email, so you can press enter to save the value
        isEditing: false,
      },
      // {
      //   label: 'Email-adres',
      //   value: this.profile?.email,
      //   type: 'email',
      //   isEditing: false,
      // },
      {
        label: 'Geboortedatum',
        value: this.formatDate(this.profile?.dateOfBirth),
        type: 'date',
        isEditing: false,
      },
      {
        label: 'Wachtwoord',
        value: '******',
        type: 'password',
        isEditing: false,
      },
    ];
  }

  startEditing(field: any) {
    field.originalValue = field.value; // Saves the orginal value
    console.log('Start editing, current value:', field.value);
    field.isEditing = true;
  }

  stopEditing(field: any) {
    const handlers: { [key: string]: (field: any) => void } = { // Object with handlers for each field type

      date: (field) => { // Handler for the date field
        const date = new Date(field.value);
        if (this.isValidDate(date)) {
          field.value = this.formatDate(date);
        } else {
          alert('De geboortedatum mag niet vandaag of later zijn.');
          field.value = field.originalValue; // Reset the value
        }
      },

      password: (field) => { // Handler for the password field
        const password = field.value;
        if (this.isValidPassword(password)) {
          field.value = this.formatPassword(password);
        } else {
          alert('Het wachtwoord moet minimaal 6 tekens lang zijn.');
          field.value = field.originalValue; // Reset the value
        }
      },

      email: (field) => { // Handler for the username field (email bcs type = email)
        const username = field.value;
        if (this.isValidUsername(username)) {
          field.value = username;
        } else {
          alert('Een gebruikersnaam moet minimaal 1 teken hebben.');
          field.value = field.originalValue; // Reset the value
        }
      },
    };
  
    if (handlers[field.type]) {
      handlers[field.type](field);
    }
  
    field.isEditing = false;
  }

  isValidDate(date: Date): boolean { // validates the date (not today or later)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } 

  isValidPassword(password: string): boolean { // validates the password (at least 6 characters)
    return password.length >= 6;
  }

  isValidUsername(username: string): boolean { // validates the username (at least 1 character)
    return username.length >= 1;
  }

  formatDate(date: Date | undefined): string { // formats the date (dd-MM-yyyy)
    return date ? this.datePipe.transform(date, 'dd-MM-yyyy') || '' : '';
  }

  formatPassword(password: string): string { // formats the password(* for every character)
    return '*'.repeat(password.length);
  }
}
import { Component, OnInit } from '@angular/core';
import { IUser, ProfilePictureEnum, UserRole } from '@spellen-doos/shared/api';
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

  private userId: string = '677d0b6ccc31fe87a70d8190'; // Dummy ID

  editableFields = [ // Loading screen
    {
      label: 'Naam',
      type: 'text',
      isEditing: false,
    },
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
    this.profileService.getProfileById(this.userId).subscribe((profile) => {
      this.profile = profile;
      this.initializeFields();
    });
  }

  profilePictureOptions = Object.values(ProfilePictureEnum);

  showPictureOptions: boolean = false;

  initializeFields() {
    console.log('ProfileComponent initializeFields');
    this.editableFields = [
      {
        label: 'Naam',
        value: this.profile?.userName,
        type: 'email', // type = email, so you can press enter to save the value
        isEditing: false,
      },
      {
        label: 'Geboortedatum',
        value: this.formatDate(this.profile!.dateOfBirth),
        type: 'date',
        isEditing: false,
      },
      {
        label: 'Wachtwoord',
        value: '********',
        type: 'password',
        isEditing: false,
      },
    ];
  }

  startEditing(field: any) {
    if (field.type === 'password') {
      console.log('test');
      field.value = this.profile!.password; // Set the value to the actual password
      console.log('password value:', field.value);
    }
    field.originalValue = field.value; // Saves the original value
    console.log('Start editing, current value:', field.value);
    field.isEditing = true;
  }

  stopEditing(field: any) {
    const handlers: { [key: string]: (field: any) => void } = { // Object with handlers for each field type

      date: (field) => { // Handler for the date field
        const date = new Date(field.value);
        if (this.isValidDate(date)) {
            field.value = this.formatDate(date);

            if (this.profile) { // Update the profile
            this.profile.dateOfBirth = date;
            this.updateProfileApi();
            }
            
        } else {
          alert('U moet minimaal 13 jaar zijn.');
          field.value = field.originalValue; // Reset the value
        }
      },

      password: (field) => { // Handler for the password field
        const password = field.value;
        console.log('password read:' + password);
        if (this.isValidPassword(password)) {
          if (this.profile) { // Update the profile
            console.log('Updating password' + password);
            this.profile.password = password;
            this.updateProfileApi();
          }
        } else {
          alert('Het wachtwoord moet minimaal 8 tekens lang zijn.');
          field.value = field.originalValue; // Reset the value
        }
      },

      email: (field) => { // Handler for the username field (email bcs type = email)
        const username = field.value;
        if (this.isValidUsername(username)) {
          field.value = username;

          if (this.profile) { // Update the profile
            this.profile.userName = username;
            this.updateProfileApi();
          }
          
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

  // Method to toggle showing the profile picture options
  togglePictureOptions(): void {
    this.showPictureOptions = !this.showPictureOptions;
  }
  // Method to select a profile picture
  selectProfilePicture(picture: ProfilePictureEnum): void {
    if (this.profile) {
      this.profile.profilePicture = picture; // Set the new profile picture
        this.updateProfileApi();
    }
    this.showPictureOptions = false; // Close the options
  }


  updateProfileApi(){ // Method to update the profile
    this.profileService.updateProfile(this.userId, this.profile!);
  }


  isValidDate(date: Date): boolean { // validates the date (13+ years old)
    const thirteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 13));
    thirteenYearsAgo.setHours(0, 0, 0, 0);
    return date < thirteenYearsAgo;
  } 

  isValidPassword(password: string): boolean { // validates the password (at least 8 characters)
    return password.length >= 8;
  }

  isValidUsername(username: string): boolean { // validates the username (at least 1 character)
    return username.length >= 1;
  }
  

  formatDate(date: Date | undefined): string { // formats the date (dd-MM-yyyy)
    return date ? this.datePipe.transform(date, 'dd-MM-yyyy') || '' : '';
  }

  // formatPassword(password: string): string { // formats the password(* for every character)
  //   return '*'.repeat(password.length);
  // }
}
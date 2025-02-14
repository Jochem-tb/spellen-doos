import { Component, OnInit } from '@angular/core';
import { IUser, ProfilePictureEnum } from '@spellen-doos/shared/api';
import { ProfileService } from './profile.service';
import { DatePipe } from '@angular/common';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'lib-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit {
  profile: IUser | null = null;
  private userId: string | null = null;
  isCheckingUsername: boolean = false;

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

    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.profileService.getProfileById(this.userId).subscribe((profile) => {
        this.profile = profile;
        this.initializeFields();
      });
    } else {
      console.error('User ID is null');
    }
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
      field.value = ''; // Clear the value for password field
    }
    field.originalValue = field.value; // Saves the original value
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
          alert('U moet minimaal 16 jaar zijn.');
          field.value = field.originalValue; // Reset the value

          }
        },

      password: async (field) => { // Handler for the password field
        const password = field.value;
        if (this.HasAsterisk(password)) {
          return;
        }
        
        if (!this.isValidPassword(password)) {
          alert('Het wachtwoord moet minimaal 8 tekens lang zijn.');
          field.value = field.originalValue; // Reset the value
          field.value = '********'; // Hides the password
          return;
        }
        
        if (this.profile) { // Update the profile
          const hashedPassword = await bcrypt.hash(this.profile.password, 10);
          this.profile.password = hashedPassword;
          this.updateProfileApi();
        }
        field.value = '********'; // Hides the password
      },
          
      email: (field) => { // Handler for the username field (email bcs type = email)
        if (this.isCheckingUsername) {
          return;
        }
      
        const username = field.value;
        if (!this.isValidUsername(username)) {
          alert('Een gebruikersnaam moet minimaal 1 teken hebben.');
          field.value = field.originalValue; // Reset the value
          return;
        }
      
        field.value = username;
        this.isCheckingUsername = true;
        this.profileService.checkUserNameExistence(username).subscribe(
          (exists) => {
            console.log('Username exists:', exists);
            this.isCheckingUsername = false;
            if (exists) {
              field.value = field.originalValue; // Reset the value
              alert("Deze gebruikersnaam bestaat al.");
              return;
            }
      
            if (this.profile) { // Update the profile
              this.profile.userName = username;
              this.updateProfileApi();
            }
          },
          () => {
            this.isCheckingUsername = false; // Reset flag on error
          }
        );
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
    if (this.userId) {
      this.profileService.updateProfile(this.userId, this.profile!);
    } else {
      console.error('User ID is null');
    }
  }


  isValidDate(date: Date): boolean { // validates the date (16+ years old)
    const thirteenYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 16));
    thirteenYearsAgo.setHours(0, 0, 0, 0);
    return date < thirteenYearsAgo;
  } 

  isValidPassword(password: string): boolean { // validates the password (at least 8 characters)
    return password.length >= 8;
  }

  HasAsterisk(password: string): boolean { // checks if the password contains a *
    if (password.includes('*')){
      return true;
    }
    return false;
  }

  isValidUsername(username: string): boolean { // validates the username (at least 1 character)
    return username.length >= 1;
  }
  

  formatDate(date: Date | undefined): string { // formats the date (dd-MM-yyyy)
    return date ? this.datePipe.transform(date, 'dd-MM-yyyy') || '' : '';
  }
}
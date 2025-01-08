export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface IUser {
  password: string;
  userName: string;
  dateOfBirth: Date;
  role: UserRole;
  profilePicture: ProfilePictureEnum;
}


export interface IUserIdentity {
  userName: string;
}

export type ICreateUser = Pick<IUser, 'password' | 'userName' | 'dateOfBirth' | 'role' | 'profilePicture'>;

export enum ProfilePictureEnum {
  Pic1 = '/profileImg/giraffe.jpg',
  Pic2 = '/profileImg/hert.jpg',
  Pic3 = '/profileImg/olifant.jpg',
  Pic4 = '/profileImg/polarBear.jpg',
  Pic5 = '/profileImg/vogel.jpg',
  Pic6 = '/profileImg/wolf.jpg',
  Pic7 = '/profileImg/zebra.jpg',
  Pic8 = '/profileImg/zeeHond.jpg',
}
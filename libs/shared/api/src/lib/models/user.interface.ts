export enum UserRole {
    Admin = 'admin',
    User = 'user'
}

export interface IUser {
  email: string;
  password: string;
  userName: string;
  dateOfBirth: Date;
  role: UserRole;
}

export interface IUserIdentity {
  email: string;
  userName: string;
  dateOfBirth: Date;
}

export type ICreateUser = Pick<IUser, 'email' | 'password' | 'userName' | 'dateOfBirth' | 'role'>;

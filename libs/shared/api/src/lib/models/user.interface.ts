export enum UserRole {
    Admin = 'admin',
    User = 'user'
}

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  dateOfBirth: Date;
  role: UserRole;
}

export interface IUserIdentity {
  email: string;
  firstName: string;
  dateOfBirth: Date;
}

export type ICreateUser = Pick<IUser, 'email' | 'password' | 'firstName' | 'dateOfBirth' | 'role'>;

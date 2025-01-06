export interface IUserCredentials {
    email: string;
    password: string;
}

export interface IUserRegestration extends IUserCredentials {
    firstName: string;
    dateOfBirth: Date;
}

export interface IToken {
    token: string;
}
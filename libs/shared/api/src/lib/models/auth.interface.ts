export interface IUserCredentials {
    userName: string;
    password: string;
}

export interface IUserRegestration extends IUserCredentials {
    userName: string;
    dateOfBirth: Date;
}

export interface IToken {
    token: string;
}
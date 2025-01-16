import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,

    ROOT_DOMAIN_URL: 'dummy',

    //* API for CRUD operations
    dataApiUrl: 'http://localhost:3000/api',
    // dataApiUrl:  'http://192.168.2.20:3000/api',

    //* Socket URL for games
    socketUrl: 'http://localhost:3000',
};

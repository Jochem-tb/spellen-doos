import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    production: false,

    ROOT_DOMAIN_URL: 'dummy',
    dataApiUrl: 'http://localhost:3000/api',
    socketUrl: 'http://localhost:3000',
    // dataApiUrl:  'http://192.168.2.20:3000/api',
};

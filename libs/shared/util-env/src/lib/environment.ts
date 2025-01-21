import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: false,

  ROOT_DOMAIN_URL: 'dummy',

  //* API for CRUD operations
  // dataApiUrl: 'http://localhost:3000/api',
  // dataApiUrl: 'http://192.168.178.204:3000/api',
  dataApiUrl: 'https://spellen-doos-api.azurewebsites.net/api',

  //* Socket URL for games
  socketUrl: 'http://localhost:3000',
  // socketUrl: 'http://192.168.178.204:3000',
  //  socketUrl: 'https://spellen-doos-api.azurewebsites.net'
};

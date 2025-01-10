import { IGame } from '../game.interface';

export interface IGameGateway {
  queue: string[];
  minPlayerForGame: number;
  maxPlayerForGame: number;
  recommendedPlayerForGame: number;
  game?: IGame;
  connectedPlayers: string[];
}

export enum BaseGatewayEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CHECK_NUM_PLAYER_QUEUE = 'checkNumPlayerQueue',
  START_GAME = 'startGame',
}

import { Socket } from 'socket.io';
import { IGame } from '../game.interface';

export interface IGameGateway<T> {
  games: Map<string, T>;
  rooms: Map<string, Socket[]>;
  queue: Socket[];
  minPlayerForGame: number;
  maxPlayerForGame: number;
  recommendedPlayerForGame: number;
}

export enum BaseGatewayEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  PLAYER_DISCONNECT = 'player_disconnected',
  GAME_OVER = 'gameOver',
  CHECK_NUM_PLAYER_QUEUE = 'checkNumPlayerQueue',
  START_GAME = 'startGame',
  SETUP_GAME = 'setupGame',
  DISPLAY_TIMER = 'displayTimer',
  PLAYER_READY = 'playerReady',
}

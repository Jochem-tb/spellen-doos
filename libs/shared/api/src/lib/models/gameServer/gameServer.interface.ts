import { IGame } from '../game.interface';

export interface IGameServer {
  queue: string[];
  minPlayerForGame: number;
  maxPlayerForGame: number;
  recommendedPlayerForGame: number;
  game?: IGame;
  connectedPlayers: string[];
}

export enum BaseGameEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

// export type ICreateGame = Pick<
//   IGame,
//   | 'name'
//   | 'shortDescription'
//   | 'longDescription'
//   | 'cardImage'
//   | 'maxPlayers'
//   | 'minPlayers'
// >;
// export type IUpdateGame = Partial<Omit<IGame, '_id'>>;

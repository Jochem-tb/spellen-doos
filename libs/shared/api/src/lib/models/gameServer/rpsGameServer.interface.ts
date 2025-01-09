import {
  IGameServer,
  BaseGameEvents,
} from '../gameServer/gameServer.interface';

export interface IRockPaperScissorGameServer extends IGameServer {
  maxRounds: number;
  currentRound: number;
  playerAWins: number;
  playerBWins: number;
  draws: number;
  playerAChoice: RockPaperScissorChoicesEnum;
  playerBChoice: RockPaperScissorChoicesEnum;

  playerAConnected: boolean;
  playerBConnected: boolean;

  roundsInfo: IRockPaperScissorRoundInfo[];
}

export enum RockPaperScissorChoicesEnum {
  Steen = 'Steen',
  Papier = 'Papier',
  Schaar = 'Schaar',
}

export interface IRockPaperScissorRoundInfo {
  round: number;
  playerAChoice: string;
  playerBChoice: string;
  winner: RockPaperScissorWinnerEnum;
}

export enum RockPaperScissorWinnerEnum {
  PlayerA = 'PlayerA',
  PlayerB = 'PlayerB',
  Draw = 'Draw',
}

export enum RPSGameEvents {
  BaseGameEvents,
  MESSAGE = 'message',
  CHANGE_CHOICE = 'changeChoice',
  RESPONSE = 'response',
}

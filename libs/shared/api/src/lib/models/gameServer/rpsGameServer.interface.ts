export interface IRPSGameServer {
  maxRounds: number;
  currentRound: number;
  playerAWins: number;
  playerBWins: number;
  draws: number;
  playerAChoice?: RPSChoicesEnum;
  playerBChoice?: RPSChoicesEnum;

  playerAConnected: boolean;
  playerBConnected: boolean;

  roundsInfo: IRPSRoundInfo[];
}

export enum RPSChoicesEnum {
  Steen = 'Steen',
  Papier = 'Papier',
  Schaar = 'Schaar',
}

export interface IRPSRoundInfo {
  round: number;
  playerAChoice: string;
  playerBChoice: string;
  winner: RPSWinnerEnum;
}

export enum RPSWinnerEnum {
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

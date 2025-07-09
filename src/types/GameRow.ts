import { Result } from './Game.ts';

export interface GameRow {
  guesses: string[] | undefined[];
  results: (Result | 'unset')[];
}

import { Result } from './Game.js';

export interface GameRow {
  guesses: string[] | undefined[];
  results: Result[];
}

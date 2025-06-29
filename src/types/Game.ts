import { getArrayWith } from '../utils/sharedUtils.ts';

export interface GameOptions {
  roundsCount: number;
  fields: number;
  allowColorDuplicate: boolean;
  colors: string[];
}

export type GameState = 'unstarted' | 'won' | 'loose' | 'inProgress';
export type Result = 'white' | 'black' | 'noMatch';

export class Game {
  public readonly colors = ['red', 'blue', 'green', 'yellow', 'purple', 'cyan'];
  private currentRound = 0;
  private readonly rounds: number;
  private gameState: GameState = 'unstarted';
  private readonly computedColors: string[];

  constructor(options: GameOptions) {
    console.debug(`Creating new game with options: ${JSON.stringify(options)}`);
    this.colors = [...options.colors];
    this.rounds = options.roundsCount;
    this.computedColors = this.randomColors(options.fields, options.allowColorDuplicate);
    console.log('init');
  }

  public getSolution(): string[] {
    switch (this.gameState) {
      case 'loose':
      case 'won':
        return [...this.computedColors];
      default:
        throw new Error('Game state not valid to show solution already');
    }
  }

  private randomColors(len: number, allowDuplicates: boolean): string[] {
    const result = [];
    const colors = [...this.colors];

    while (true) {
      const index = Math.floor(Math.random() * colors.length);
      if (colors[index] != undefined) {
        result.push(colors[index]);
        if (result.length == len) {
          return result;
        }
        if (!allowDuplicates) {
          colors.splice(index, 1);
        }
      }
    }
  }

  public startGame() {
    if (this.gameState != 'unstarted') {
      throw new Error('Game already started');
    }
    this.gameState = 'inProgress';
  }

  public getCurrentRound(): number {
    return this.currentRound;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public check(colors: string[]): Result[] {
    if (this.gameState == 'won') {
      throw new Error('Game already won');
    } else if (this.gameState == 'loose') {
      throw new Error('Game already over. You loosed');
    } else if (this.gameState != 'inProgress') {
      throw new Error('Game not running anymore or not started yet.');
    }

    const computed: (string | null)[] = [...this.computedColors];
    const guessed: (string | null)[] = [...colors];
    let matchesExact = 0;
    let matchedColor = 0;

    // count black
    for (let i = 0; i < computed.length; i++) {
      if (computed[i] == guessed[i]) {
        matchesExact++;
        computed[i] = null;
        guessed[i] = null;
      }
    }

    // count white
    for (let i = 0; i < computed.length; i++) {
      if (guessed[i] && computed.includes(guessed[i])) {
        matchedColor++;
        const index = computed.indexOf(guessed[i]);
        computed[index] = null;
      }
    }

    if (matchesExact == this.computedColors.length) {
      this.gameState = 'won';
    } else if (this.currentRound + 1 >= this.rounds) {
      this.gameState = 'loose';
    } else {
      this.currentRound++;
    }
    const result = [
      ...getArrayWith<Result>(matchesExact, 'black'),
      ...getArrayWith<Result>(matchedColor, 'white'),
      ...getArrayWith<Result>(this.computedColors.length - matchesExact - matchedColor, 'noMatch'),
    ];
    console.debug('Checked', result);
    return result;
  }
}

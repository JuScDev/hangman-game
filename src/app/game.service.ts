import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { GameStatus } from './models/models';
import { GameConnectorService } from './game-connector.service';
import { GamePersistenceService } from './game-persistence.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public readonly gameStatus: WritableSignal<GameStatus> = signal(
    GameStatus.IN_PROGRESS
  );

  public readonly alreadyGuessedLetters: WritableSignal<Array<string>> = signal(
    []
  );

  public readonly wrongUserGuessesCount = signal(0);

  public readonly wordToGuessArray: WritableSignal<Array<string>> = signal([]);

  public readonly wordToGuess = signal('');

  public readonly gamesWon = signal(0);

  public readonly gamesLost = signal(0);

  private readonly _maxWrongGuesses = 10;

  private readonly _gameConnectorService = inject(GameConnectorService);

  private readonly _gamePersistenceService = inject(GamePersistenceService);

  public async startNewGame(): Promise<void> {
    this.gameStatus.set(GameStatus.IN_PROGRESS);
    this.alreadyGuessedLetters.set([]);
    this.wrongUserGuessesCount.set(0);
    this.wordToGuessArray.set([]);
    const newWord = await this.getNewWord();
    this.wordToGuess.set(newWord[0]);

    Array.from(this.wordToGuess()).forEach(() => {
      this.wordToGuessArray.update((wordToGuess) => [...wordToGuess, '_']);
    });
  }

  public async getNewWord(): Promise<Array<string>> {
    return this._gameConnectorService.getNewWord();
  }

  public checkGuessedLetter(guessedLetter: string): GameStatus {
    if (!guessedLetter || /\d/.test(guessedLetter)) {
      return GameStatus.IN_PROGRESS;
    }

    guessedLetter = guessedLetter.toLowerCase();

    this.alreadyGuessedLetters.update((alreadyGuessedLetters) => [
      ...alreadyGuessedLetters,
      guessedLetter,
    ]);

    if (!this.wordToGuess().toLowerCase().includes(guessedLetter)) {
      this.wrongUserGuessesCount.update((wrongUserGuessesCount) => {
        if (wrongUserGuessesCount + 1 >= this._maxWrongGuesses) {
          this._finishGame(GameStatus.LOST);
        }

        return wrongUserGuessesCount + 1;
      });
    } else {
      Array.from(this.wordToGuess().toLowerCase()).forEach((letter, index) => {
        if (letter === guessedLetter) {
          this.wordToGuessArray.update((wordToGuessArray) => {
            wordToGuessArray[index] = this.wordToGuess()[index];
            return wordToGuessArray;
          });
        }
      });

      if (!this.wordToGuessArray().includes('_')) {
        this._finishGame(GameStatus.WON);
      }
    }

    return this.gameStatus();
  }

  public getWonGamesAmount(): number {
    return this._gamePersistenceService.getWonGamesAmount();
  }

  public getLostGamesAmount(): number {
    return this._gamePersistenceService.getLostGamesAmount();
  }

  private _finishGame(gameStatus: GameStatus): void {
    this.gameStatus.set(gameStatus);

    if (gameStatus === GameStatus.WON) {
      this.gamesWon.update((gamesWon) => gamesWon + 1);
      this._gamePersistenceService.addWonGamePersistence();
    } else {
      this.gamesLost.update((gamesLost) => gamesLost + 1);
      this._gamePersistenceService.addLostGamePersistence();
    }
  }
}

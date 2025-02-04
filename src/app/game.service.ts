import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { GameStatus } from './models/models';
import { GameConnectorService } from './game-connector.service';

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

  private readonly _maxWrongGuesses = 10;

  private readonly _gameConnectorService = inject(GameConnectorService);

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
    if (!guessedLetter) {
      return GameStatus.IN_PROGRESS;
    }

    this.alreadyGuessedLetters.update((alreadyGuessedLetters) => [
      ...alreadyGuessedLetters,
      guessedLetter,
    ]);

    if (!this.wordToGuess().includes(guessedLetter)) {
      this.wrongUserGuessesCount.update((wrongUserGuessesCount) => {
        if (wrongUserGuessesCount + 1 >= this._maxWrongGuesses) {
          this.gameStatus.set(GameStatus.LOST);
        }

        return wrongUserGuessesCount + 1;
      });
    } else {
      Array.from(this.wordToGuess()).forEach((letter, index) => {
        if (letter === guessedLetter) {
          this.wordToGuessArray.update((wordToGuessArray) => {
            wordToGuessArray[index] = guessedLetter;
            return wordToGuessArray;
          });
        }
      });

      if (!this.wordToGuessArray().includes('_')) {
        this.gameStatus.set(GameStatus.WON);
      }
    }

    return this.gameStatus();
  }
}

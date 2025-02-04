import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { HangmanSvgComponent } from '../hangman-svg/hangman-svg.component';
import { GameStatus } from '../models/models';

@Component({
  selector: 'app-game',
  imports: [HangmanSvgComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  @ViewChild('input')
  public inputElement: ElementRef | null = null;

  @ViewChild('resultDialog')
  public resultDialog: ElementRef | null = null;

  public gameStatusEnum = GameStatus;

  public readonly gameService = inject(GameService);

  public ngOnInit(): void {
    this.gameService.startNewGame();
  }

  public ngAfterViewInit(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
    }
  }

  public get gameNotInProgress(): boolean {
    return this.gameService.gameStatus() !== GameStatus.IN_PROGRESS;
  }

  public submitGuessedLetter(): void {
    if (this.inputElement) {
      const gameStatus = this.gameService.checkGuessedLetter(
        this.inputElement.nativeElement.value
      );
      this.inputElement.nativeElement.value = '';

      if (gameStatus === GameStatus.IN_PROGRESS) {
        this.inputElement.nativeElement.focus();
        return;
      }

      if (this.resultDialog) {
        this.resultDialog.nativeElement.showModal();
      }
    }
  }

  public closeDialog(): void {
    if (this.resultDialog) {
      this.resultDialog.nativeElement.close();
    }
  }

  public restartGame(): void {
    if (this.resultDialog) {
      this.closeDialog();
      this.gameService.startNewGame();

      if (this.inputElement) {
        this.inputElement.nativeElement.focus();
      }
    }
  }
}

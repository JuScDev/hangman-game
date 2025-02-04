import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hangman-svg',
  imports: [],
  templateUrl: './hangman-svg.component.html',
  styleUrl: './hangman-svg.component.scss',
})
export class HangmanSvgComponent {
  public wrongUserGuessesCount = input.required<number>();
}

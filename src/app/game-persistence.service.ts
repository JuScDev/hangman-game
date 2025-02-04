import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GamePersistenceService {
  private readonly gemesWonKey = 'gamesWon';

  private readonly gamesLostKey = 'gamesLost';

  public getWonGamesAmount(): number {
    return parseInt(localStorage.getItem(this.gemesWonKey) ?? '0', 10);
  }

  public addWonGamePersistence(): void {
    localStorage.setItem(
      this.gemesWonKey,
      (this.getWonGamesAmount() + 1).toString()
    );
  }

  public getLostGamesAmount(): number {
    return parseInt(localStorage.getItem(this.gamesLostKey) ?? '0', 10);
  }

  public addLostGamePersistence(): void {
    localStorage.setItem(
      this.gamesLostKey,
      (this.getLostGamesAmount() + 1).toString()
    );
  }
}

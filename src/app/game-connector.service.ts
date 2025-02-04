import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameConnectorService {
  public async getNewWord(): Promise<Array<string>> {
    return (
      await fetch('https://random-word-api.herokuapp.com/word?number=1')
    ).json();
  }
}

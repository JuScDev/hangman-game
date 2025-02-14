# Hangman Game

This is a simple Hangman game built with Angular. The game allows users to guess letters to form a word, with a limited number of wrong guesses allowed before the game is lost.

## Features

- Random word generation using an external API
- Tracks the number of games won and lost
- Responsive SVG-based hangman drawing
- Local storage persistence for game statistics

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hangman-game.git
   cd hangman-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`.

## Usage

- Start a new game by clicking the "New Game" button.
- Guess letters by typing in the input field and pressing Enter or clicking the "Check letter" button.
- The game will display the hangman drawing as you make wrong guesses.
- The game ends when you either guess the word correctly or reach the maximum number of wrong guesses.
- View your game statistics (games won and lost) at the bottom of the page.

## Project Structure

- `src/app/hangman-svg/`: Contains the Hangman SVG component for drawing the hangman.
- `src/app/game/`: Contains the main game component and related styles.
- `src/app/services/`: Contains services for game logic, persistence, and API communication.
- `src/app/models/`: Contains the game status model.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

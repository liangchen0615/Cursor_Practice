// pages/index/index.js
const ANSWER = ['W', 'O', 'R', 'D', 'S']; // Example answer, can be randomized

Page({
  data: {
    guesses: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ],
    colors: [
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ],
    keyboard: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL', 'ENTER']
    ],
    currentGuess: 0,
    currentLetters: [],
    message: '',
    gameOver: false
  },
  onLoad() {
    // Placeholder for future logic
  },
  onKeyTap(e) {
    if (this.data.gameOver) return;
    const key = e.currentTarget.dataset.key;
    let { currentLetters, guesses, currentGuess, message } = this.data;
    if (currentGuess >= 5) return; // Only allow 5 guesses
    if (key === 'DEL') {
      if (currentLetters.length > 0) {
        currentLetters.pop();
        guesses[currentGuess][currentLetters.length] = '';
      }
    } else if (key === 'ENTER') {
      if (currentLetters.length === 5) {
        guesses[currentGuess] = [...currentLetters];
        this.setData({ guesses });
        this.checkGuess();
        return;
      } else {
        message = 'Not enough letters';
      }
    } else {
      if (currentLetters.length < 5) {
        currentLetters.push(key);
        guesses[currentGuess][currentLetters.length - 1] = key;
      }
    }
    this.setData({ guesses, currentLetters, message });
  },
  checkGuess() {
    let { currentGuess, guesses, colors } = this.data;
    const guess = guesses[currentGuess];
    const answer = [...ANSWER];
    let colorRow = ['', '', '', '', ''];
    let answerUsed = [false, false, false, false, false];
    // First pass: mark greens
    for (let i = 0; i < 5; i++) {
      if (guess[i] === answer[i]) {
        colorRow[i] = 'green';
        answerUsed[i] = true;
      }
    }
    // Second pass: mark yellows and greys
    for (let i = 0; i < 5; i++) {
      if (colorRow[i] === 'green') continue;
      let found = false;
      for (let j = 0; j < 5; j++) {
        if (!answerUsed[j] && guess[i] === answer[j]) {
          found = true;
          answerUsed[j] = true;
          break;
        }
      }
      colorRow[i] = found ? 'yellow' : 'grey';
    }
    colors[currentGuess] = colorRow;
    // Check if the guess is correct
    if (guess.join('') === answer.join('')) {
      this.setData({
        colors,
        message: 'Congratulations! You guessed the word!',
        gameOver: true
      });
      return;
    }
    if (currentGuess < 4) {
      this.setData({
        colors,
        currentGuess: currentGuess + 1,
        currentLetters: [],
        message: ''
      });
    } else {
      this.setData({ colors, message: 'Game Over!', gameOver: true });
    }
  }
}); 
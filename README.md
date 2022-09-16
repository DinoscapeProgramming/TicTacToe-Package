# TicTacToe Package
A package you can use to create a TicTacToe game

## Documentation
### Setup
```js
const TictTacToe = require('tictactoe.io'); 
```

### Create game
```js
const Game = new TicTacToe.Game("Foo" /*First player*/, "Bar" /*Second player*/);
```

### Place field
```js
Game.place("Foo" /*The player doing this move*/, 3 /*number from 1 to 9*/);
```

### Get Board
```js
Game.getBoard().then((response) => {
  console.log(response.board || Game.board);
});
```

### Get Board As Text
```js
Game.getBoard().then((response) => {
  console.log(response.textBoard || Game.textBoard);
});
```

### Get turn
```js
Game.getBoard().then((response) => {
  console.log(response.turn || Game.turn);
});
```
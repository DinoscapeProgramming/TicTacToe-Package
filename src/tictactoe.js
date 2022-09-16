const crypto = require('crypto');
const util = require('./util.js');
const defaultErrors = {
  ivldOpts: "No options were given",
  invldKey: function (key, plural) { return "No " + key + ((plural === true) ? "were" : "was") + "given" }
}

function winner(options) {
  return new Promise((resolve, reject) => {
    if (!options || Object.keys(options).length === 0) return resolve({ action: "winner", err: "Invalid options" });
    if (!Object.keys(options).includes("game") || !options.game) return resolve({ action: "winner", err: "No game was given" });
    if (!Array.isArray(options.game) || options.game.length !== 3) return resolve({ action: "winner", err: "Invalid game" });
    return resolve({
      action: "winner",
      winner: (
        JSON.stringify(options.game).includes("[1,1,1]") || JSON.stringify(
          (
            [
              [
                options.game[0][0],
                options.game[1][0],
                options.game[2][0]],
              [
                options.game[0][1],
                options.game[1][1],
                options.game[2][1]],
              [
                options.game[0][2],
                options.game[1][2],
                options.game[2][2]
              ]
            ]
          )
        ).includes("[1,1,1]") || (
          (
            (options.game[0][0] === 1) && (options.game[1][1] === 1) && (options.game[2][2] === 1)
          )
        ) || (
          (options.game[0][2] === 1) && (options.game[1][1] === 1) && (options.game[2][0] === 1)
        )
      ) ? 1 : (
        (
          JSON.stringify(options.game).includes("[2,2,2]") || JSON.stringify(
            (
              [
                [
                  options.game[0][0],
                  options.game[1][0],
                  options.game[2][0]],
                [
                  options.game[0][1],
                  options.game[1][1],
                  options.game[2][1]],
                [
                  options.game[0][2],
                  options.game[1][2],
                  options.game[2][2]
                ]
              ]
            )
          ).includes("[2,2,2]") || (
            (
              (options.game[0][0] === 2) && (options.game[1][1] === 2) && (options.game[2][2] === 2)
            ) || (
              (options.game[0][2] === 2) && (options.game[1][1] === 2) && (options.game[2][0] === 2)
            )
          )
        ) ? 2 : (
          (
            !options.game.map((line) => line.map((item) => item.toString()).join("")).join("").includes("0")
          ) ? 3 : 0
        )
      )
    });
  });
}

function winnerSync(options) {
  if (!options || Object.keys(options).length === 0) return { action: "winner", err: "Invalid options" };
  if (!Object.keys(options).includes("game") || !options.game) return { action: "winner", err: "No game was given" };
  if (!Array.isArray(options.game) || options.game.length !== 3) return { action: "winner", err: "Invalid game" };
  return {
    action: "winner",
    winner: (
      JSON.stringify(options.game).includes("[1,1,1]") || JSON.stringify(
        (
          [
            [
              options.game[0][0],
              options.game[1][0],
              options.game[2][0]],
            [
              options.game[0][1],
              options.game[1][1],
              options.game[2][1]],
            [
              options.game[0][2],
              options.game[1][2],
              options.game[2][2]
            ]
          ]
        )
      ).includes("[1,1,1]") || (
        (
          (options.game[0][0] === 1) && (options.game[1][1] === 1) && (options.game[2][2] === 1)
        )
      ) || (
        (options.game[0][2] === 1) && (options.game[1][1] === 1) && (options.game[2][0] === 1)
      )
    ) ? 1 : (
      (
        JSON.stringify(options.game).includes("[2,2,2]") || JSON.stringify(
          (
            [
              [
                options.game[0][0],
                options.game[1][0],
                options.game[2][0]],
              [
                options.game[0][1],
                options.game[1][1],
                options.game[2][1]],
              [
                options.game[0][2],
                options.game[1][2],
                options.game[2][2]
              ]
            ]
          )
        ).includes("[2,2,2]") || (
          (
            (options.game[0][0] === 2) && (options.game[1][1] === 2) && (options.game[2][2] === 2)
          ) || (
            (options.game[0][2] === 2) && (options.game[1][1] === 2) && (options.game[2][0] === 2)
          )
        )
      ) ? 2 : (
        (
          !options.game.map((line) => line.map((item) => item.toString()).join("")).join("").includes("0")
        ) ? 3 : 0
      )
    )
  };
}

function convertToField(options) {
  return new Promise((resolve, reject) => {
    if (!util.validOptions(options)) return resolve(util.returnError("convertToField", defaultErrors.invldOpts));
    if (!util.hasKey("value", options)) return resolve(util.returnError("convertToField", defaultErrors.invldKey("value")));
    if (typeof options.value !== "number") return resolve(util.returnError("convertToField", "Invalid number"));
    var field;
    try {
      field = ((Math.ceil(options.value / 3) + 1).toString()) + (((Math.ceil(options.value / 3) * 3) - options.value).toString());
    } catch (err) {
      return resolve(util.returnError("convertToField", err.message));
    }
    return resolve({ action: "convertToField", value: options.value, field });
  });
}

function convertToFieldSync(options) {
  if (!util.validOptions(options)) return util.returnError("convertToFieldSync", defaultErrors.invldOpts);
  if (!util.hasKey("value", options)) return util.returnError("convertToFieldSync", defaultErrors.invldKey("value"));
  if (typeof options.value !== "number") return util.returnError("convertToFieldSync", "Invalid number");
  var field;
  try {
    field = ((Math.ceil(options.value / 3) + 1).toString()) + (((Math.ceil(options.value / 3) * 3) - options.value).toString());
  } catch (err) {
    return util.returnError("convertToFieldSync", err.message);
  }
  return { action: "convertToFieldSync", value: options.value, field };
}

function startGame(options) {
  return new Promise((resolve, reject) => {
    if (!util.validOptions(options)) return resolve(util.returnError("startGame", defaultErrors.invldOpts));
    if (!util.hasKey("players", options)) return resolve(util.returnError("startGame", defaultErrors.invldKey("players", true)));
    if (!Array.isArray(options.players) || options.players.length < 2) return resolve(util.returnError("startGame", "Invalid players"));
    crypto.randomBytes(4, (err, id) => {
      if (err) return resolve(util.returnError("startGame", err.message));
      var role = Math.floor(Math.random() * 2) + 1;
      var turn = Math.floor(Math.random() * 2) + 1;
      module.exports = {
        games: {
          ...module.exports.games || [],
          ...[
            {
              id: id.toString("hex"),
              players: {
                [options.players[0]]: role,
                [options.players[1]]: (role === 1) ? 2 : 1
              },
              board: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
              ],
              turn
            }
          ]
        }
      }
      return resolve({ action: "startGame", id: id.toString("hex"), players: options.player });
    });
  });
}

function startGameSync(options) {
  if (!util.validOptions(options)) return util.returnError("startGameSync", defaultErrors.invldOpts);
  if (!util.hasKey("players", options)) return util.returnError("startGameSync", defaultErrors.invldKey("players", true));
  if (!Array.isArray(options.players) || options.players.length < 2) return util.returnError("startGameSync", "Invalid players");
  var id;
  try {
    id = crypto.randomBytes(4);
  } catch (err) {
    return util.returnError("startGameSync", err.message);
  }
  var role = Math.floor(Math.random() * 2) + 1;
  var turn = Math.floor(Math.random() * 2) + 1;
  module.exports = {
    games: {
      ...module.exports.games || [],
      ...[
        {
          id: id.toString("hex"),
          players: {
            [options.players[0]]: role,
            [options.players[1]]: (role === 1) ? 2 : 1
          },
          board: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
          ],
          turn
        }
      ]
    }
  }
  return { action: "startGameSync", id: id.toString("hex"), players: options.player };
}

function placeField(options) {
  return new Promise((resolve, reject) => {
    if (!util.validOptions(options)) return resolve({ action: "placeField", err: "No options were given" });
    if (!util.hasKey("gameId")) return resolve({ action: "placeField", err: "No game id was given" });
    if (!util.hasKey("playerName")) return resolve({ action: "placeField", err: "No player name was given" });
    if (!module.exports.games.map((game) => game.id).includes(options.gameId)) return resolve({ action: "placeField", err: "Invalid game id" });
    if (!Object.keys(module.exports.games.find((game) => game.id === options.gameId).players).includes(options.playerName)) return resolve({ action: "placeField", err: "You are not in this match" });
    if (module.exports.games.find((game) => game.id === options.gameId).players[options.playerName] !== module.exports.games.find((game) => game.id === options.gameId).turn) return resolve({ action: "placeField", err: "It is not your turn" });
    if (!Object.keys(options).includes("field") || !options.field) return resolve({ action: "placeField", err: "No field was given" });
    convertToField({ value: options.field }).then((convertedField) => {
      if (convertedField.err) return resolve({ action: "placeField", err: convertedField.err });
      module.exports.games = [
        ...module.exports.games || [],
        ...[
          ...module.exports.games.find((game) => game.id === options.gameId),
          ...{
            board: module.exports.games.find((game) => game.id === options.gameId).board.map((item, index) => (index === Number(convertedField.field[0])) ? item.map((argument, i) => ((i === Number(convertedField.field[1])) && argument === 0) ? module.exports.games.find((game) => game.id === options.gameId).players[options.playerName] : argument) : item)
          }
        ]
      ];
      if (err) return resolve({ action: "placeField", err: err.message });
      winner(module.exports.games.find((game) => game.id === options.gameId).board).then((result) => {
        if (result.err) return resolve(result);
        return resolve({ action: "placeField", userId, gameId: options.gameId, field: options.field, winner: result.winner });
      });
    });
  });
}

function placeFieldSync(options) {
  if (!util.validOptions(options)) return { action: "placeFieldSync", err: "No options were given" };
  if (!util.hasKey("gameId")) return { action: "placeFieldSync", err: "No game id was given" };
  if (!util.hasKey("playerName")) return { action: "placeFieldSync", err: "No player name was given" };
  if (!module.exports.games.map((game) => game.id).includes(options.gameId)) return { action: "placeFieldSync", err: "Invalid game id" };
  if (!Object.keys(module.exports.games.find((game) => game.id === options.gameId).players).includes(options.playerName)) return { action: "placeFieldSync", err: "You are not in this match" };
  if (module.exports.games.find((game) => game.id === options.gameId).players[options.playerName] !== module.exports.games.find((game) => game.id === options.gameId).turn) return { action: "placeFieldSync", err: "It is not your turn" };
  if (!Object.keys(options).includes("field") || !options.field) return { action: "placeFieldSync", err: "No field was given" };
  if (convertToFieldSync({ value: options.field }).err) return { action: "placeFieldSync", err: convertToFieldSync({ value: options.field }).err };
  module.exports.games = [
    ...module.exports.games || [],
    ...[
      ...module.exports.games.find((game) => game.id === options.gameId),
      ...{
        board: module.exports.games.find((game) => game.id === options.gameId).board.map((item, index) => (index === Number(convertToFieldSync({ value: options.field }).field[0])) ? item.map((argument, i) => ((i === Number(convertToFieldSync({ value: options.field }).field[1])) && argument === 0) ? module.exports.games.find((game) => game.id === options.gameId).players[options.playerName] : argument) : item)
      }
    ]
  ];
  if (winnerSync(module.exports.games.find((game) => game.id === options.gameId).board).err) return winnerSync(module.exports.games.find((game) => game.id === options.gameId).board);
  return { action: "placeFieldSync", userId, gameId: options.gameId, field: options.field, winner: winnerSync(module.exports.games.find((game) => game.id === options.gameId).board).winner };
}

function getGameById(options) {
  return new Promise((resolve, reject) => {
    if (!util.validOptions(options)) return resolve(util.returnError("startGame", defaultErrors.invldOpts));
    if (!util.hasKey("gameId", options)) return resolve(util.returnError("startGame", defaultErrors.invldKey("game id")));
    if (!Object.keys(module.exports.games || {}).includes(options.id)) return resolve(util.returnError("getGameById", "Invalid game id"));
    return resolve({
      action: "startGame",
      gameId: options.gameId,
      game: {
        board: module.exports.games.find((game) => game.id === options.id).board,
        textBoard: module.exports.games.find((game) => game.id === options.id).board.map((line) => (line.join(module.exports.games.find((game) => game.id === options.id).players[options.playerName]) === 1) ? "X" : "O").join("\n"),
        turn: module.exports.games.find((game) => game.id === options.id).turn,
        place: function (playerName, field) {
          return placeField({ id: options.id, playerName, field });
        },
        getBoard: function () {
          return new Promise((rs, rj) => {
            rs({
              action: "getBoard",
              board: module.exports.games.find((game) => game.id === options.id).board,
              textBoard: module.exports.games.find((game) => game.id === options.id).board.map((line) => (line.join(module.exports.games.find((game) => game.id === options.id).players[options.playerName]) === 1) ? "X" : "O").join("\n"),
              boardTurn: module.exports.games.find((game) => game.id === options.id).turn
            });
          });
        }
      }
    });
  });
}

function getGameByIdSync(options) {
  if (!util.validOptions(options)) return util.returnError("startGame", defaultErrors.invldOpts);
  if (!util.hasKey("gameId", options)) return util.returnError("startGame", defaultErrors.invldKey("id"));
  if (!Object.keys(module.exports.games || {}).includes(options.id)) return util.returnError("getGameById", "Invalid game id");
  return {
    action: "startGame",
    gameId: options.gameId,
    game: {
      board: module.exports.games.find((game) => game.id === options.id).board,
      textBoard: module.exports.games.find((game) => game.id === options.id).board.map((line) => (line.join(module.exports.games.find((game) => game.id === options.id).players[options.playerName]) === 1) ? "X" : "O").join("\n"),
      turn: module.exports.games.find((game) => game.id === options.id).turn,
      place: function (playerName, field) {
        return placeFieldSync({ id: options.id, playerName, field });
      },
      getBoard: function () {
        return {
          action: "getBoardSync",
          board: module.exports.games.find((game) => game.id === options.id).board,
          textBoard: module.exports.games.find((game) => game.id === options.id).board.map((line) => (line.join(module.exports.games.find((game) => game.id === options.id).players[options.playerName]) === 1) ? "X" : "O").join("\n"),
          turn: module.exports.games.find((game) => game.id === options.id).turn
        };
      }
    }
  };
}

class Game {
  constructor(firstPlayer, secondPlayer) {
    startGame([firstPlayer, secondPlayer]).then((game) => {
      this.gameId = game.id;
    });
  }
  place(playerName, field) {
    getGameById({ gameId: this.gameId }).then((game) => {
      this.placeEventListener();
      if (winnerSync(module.exports.games.find((game) => game.id === options.gameId).board.map((item, index) => (index === Number(convertToFieldSync(field).field[0])) ? item.map((argument, i) => ((i === Number(convertToFieldSync(field).field[1])) && argument === 0) ? module.exports.games.find((game) => game.id === this.gameId).players[playerName] : argument) : item)).winner !== 0) this.winEventListener(winnerSync(module.exports.games.find((game) => game.id === options.gameId).board.map((item, index) => (index === Number(convertToFieldSync(field).field[0])) ? item.map((argument, i) => ((i === Number(convertToFieldSync(field).field[1])) && argument === 0) ? module.exports.games.find((game) => game.id === this.gameId).players[playerName] : argument) : item)).winner, module.exports.games.find((game) => game.id === this.matchId).board, module.exports.games.find((game) => game.id === this.matchId).textBoard);
      return game.place(playerName, field);
    });
  }
  getBoard() {
    getGameById({ gameId: this.gameId }).then((game) => {
      return game.getBoard();
    });
  }
  addEventListener(type, func) {
    if (type === "place") {
      this.placeEventListener = func;
    } else if (type === "win") {
      this.winEventListener = func;
    }
  }
  board = getGameByIdSync({ gameId: this.gameId }).board
  textBoard = getGameByIdSync({ gameId: this.gameId }).textBoard
  turn = getGameByIdSync({ gameId: this.gameId }).turn
}

module.exports = {
  Game,
  winner,
  convertToField,
  startGame,
  placeField,
  getGameById,
  winnerSync,
  convertToFieldSync,
  startGameSync,
  placeFieldSync,
  getGameByIdSync
}

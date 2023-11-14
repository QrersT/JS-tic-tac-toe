"use strict";

function chooseColumns() {
  const buttons = document.querySelectorAll("[data-columns]");
  const gameField = document.querySelector(".game-field");
  let columns = 0;

  if (!document.querySelector(".game__players-moove")) {
    document.querySelector(".main__container").insertAdjacentHTML("beforebegin", `<h2 class="game__players-moove">Players  <span class="player-num">1</span>  moove</h2>`);
  }

  function switchPlayer() {
    const playerNum = document.querySelector(".player-num");
    if (--playerNum.innerHTML) {
      playerNum.innerHTML = `1`;
    } else {
      playerNum.innerHTML = `2`;
    }
  }

  function checkOnWin(button, player) {
    const dataRowIndex = button.closest("[data-row]").dataset.row;
    const dataSquareIndex = button.dataset.square;

    let playerNum = player.innerHTML;
    +playerNum;
    let crossOrCircle = "";
    console.log(playerNum);
    if (+playerNum === 2) {
      crossOrCircle = "_cross";
    } else crossOrCircle = "_circle";

    console.log(crossOrCircle);
    const winningStates = [
      //rule
      [
        //item
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex, +dataSquareIndex - 1],
        [+dataRowIndex, +dataSquareIndex - 2],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex - 1, +dataSquareIndex],
        [+dataRowIndex - 2, +dataSquareIndex],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex, +dataSquareIndex + 1],
        [+dataRowIndex, +dataSquareIndex + 2],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex + 1, +dataSquareIndex],
        [+dataRowIndex + 2, +dataSquareIndex],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex - 1, +dataSquareIndex - 1],
        [+dataRowIndex - 2, +dataSquareIndex - 2],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex - 1, +dataSquareIndex + 1],
        [+dataRowIndex - 2, +dataSquareIndex + 2],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex + 1, +dataSquareIndex + 1],
        [+dataRowIndex + 2, +dataSquareIndex + 2],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex + 1, +dataSquareIndex - 1],
        [+dataRowIndex + 2, +dataSquareIndex - 2],
      ],
      //-----------------------------------------------------------------
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex - 1, +dataSquareIndex],
        [+dataRowIndex + 1, +dataSquareIndex],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex, +dataSquareIndex - 1],
        [+dataRowIndex, +dataSquareIndex + 1],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex - 1, +dataSquareIndex - 1],
        [+dataRowIndex + 1, +dataSquareIndex + 1],
      ],
      [
        [+dataRowIndex, +dataSquareIndex],
        [+dataRowIndex - 1, +dataSquareIndex + 1],
        [+dataRowIndex + 1, +dataSquareIndex - 1],
      ],
    ];

    function youWin(isWin) {
      let whichPlayer = document.querySelector(".player-num").innerHTML;
      +whichPlayer;
      whichPlayer == 2 ? (whichPlayer = 1) : (whichPlayer = 2);
      console.log(whichPlayer, isWin);
      setTimeout(() => {
        if (whichPlayer == 1) {
          alert("Player Cross win");
        } else alert("Player Circle win");
      }, 20);
    }
    let isWin = false;

    winningStates.forEach((rule) => {
      /* console.log(item); */ console.log("next rule");

      let coincidence = [];
      /* console.log(rule[index]); */
      rule.forEach((item, i) => {
        const dataRow = document.querySelector(`[data-row="${item[0]}"]`);
        if (dataRow !== null && dataRow.querySelector(`[data-square="${item[1]}"]`) !== null && dataRow.querySelector(`[data-square="${item[1]}"]`).classList.contains(`${crossOrCircle}`)) {
          /* console.log(dataRow.querySelector(`[data-square="${item[1]}"]`)); */
          coincidence[i] = true;
          return true;
        } else {
          coincidence[i] = false;
          return false;
        }
      });

      if (coincidence[0] === true && coincidence[1] === true && coincidence[2] === true) {
        console.log(coincidence);
        isWin = true;
      }
      /*  console.log(rule); */
    });
    /* console.log(playerNum.innerHTML); */
    if (isWin) {
      youWin(isWin);
    }

    /*     console.log(isWin); */
  }

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      columns = +button.dataset.columns;
      document.querySelector(".choose__menu").remove();
      document.querySelector(".game__players-moove").classList.add("_active");
      document.querySelector(".main__wrapper").classList.add("_active");
      makeField(columns);
      game();
    });
  });

  function makeField(numberOfColumns) {
    let htmlContent = ``;

    function squaresInRow(numberOfColumns) {
      let number = 0;
      let htmlSquare = ``;
      for (let i = 0; i < numberOfColumns; i++) {
        htmlSquare += `<div data-square="${number}" class="game__square"></div>`;
        number++;
      }
      return htmlSquare;
    }
    let number = 0;
    for (let i = 0; i < numberOfColumns; i++) {
      htmlContent += `<div data-row="${number}" class="game__row">
            ${squaresInRow(numberOfColumns)}
        </div> `;
      number++;
    }
    //-----------------------------------------------------------------

    //-----------------------------------------------------------------

    gameField.classList.add("_active");
    gameField.innerHTML = htmlContent;
  }
  //-----------------------------------------------------------------

  //-----------------------------------------------------------------
  function game() {
    const squares = document.querySelectorAll(".game__square");
    const playerNum = document.querySelector(".player-num");
    squares.forEach((square) => {
      square.addEventListener("click", (e) => {
        if (!square.classList.contains("_circle") && !square.classList.contains("_cross")) {
          switchPlayer();
        }

        if (+playerNum.innerHTML === 1) {
          if (!square.classList.contains("_cross")) {
            square.classList.add("_circle");
          }
        } else {
          if (!square.classList.contains("_circle")) {
            square.classList.add("_cross");
          }
        }
        checkOnWin(square, playerNum);
      });
    });
  }
}

chooseColumns();

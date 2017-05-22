$(document).ready(function() {
  var simon = $(".simon"); // Array of simon buttons. red is simon[0], yellow is simon[1], green is simon[2], blue is simon[3].
  var audio = $(".audio");
  var startButton = $("#start");
  var strictButton = $("#strict");
  var startText = $("#starttext");
  var strictText = $("#stricttext");
  var count = 0;
  var clicks = 0;
  var userTurn = false;
  var wait = 800;
  var array = [];
  var userArray = [];
  var strict = false;
  var counter = $("#counter");
  var goal = 20;

  function createArray() {
    var arr = [];
    for (var i = 0; i < 20; i++) {
      arr.push(Math.floor(Math.random() * 4));
    }
    return arr;
  }

  //play function -  plays sound of selected button. Button is a number referring to a simon button.
  function playButton(buttonId) {
    // e.g. playButton(1) {
    audio[buttonId].play();
   
    $(simon[buttonId]).animate({opacity: "toggle"}, wait/5);
    $(simon[buttonId]).animate({opacity: "toggle"}, wait/4);
  }

  // stops the game, clears array etc.

  function stopGame() {
    if (count == goal) {
      $("#dialogue").html("VICTORY!");
      audio[4].play();
    } else {
      $("#dialogue").html("GAME OVER");
    }

    userTurn = false;
    count = 0;
    counter.html(count);
    clicks = 0;
    startButton.css("background-color", "");
    startText.html("START");
    array = [];
    userArray = [];
  }

  // alerts user to mistake if input is incorrect, and either ends game (if in strict mode) or replays last sequence
  function mistake() {
    userTurn = false;
    $(simon).animate({opacity: "toggle"}, wait/5);
    $(simon).animate({opacity: "toggle"}, wait/4);
    audio[5].play();

    if (!strict) {
      setTimeout(function() {
        playSounds();
      }, wait);
    } else {
      stopGame();
    }
  }

  // plays array of sounds up to current count
  function playSounds() {
    userTurn = false;
    var playBack = 0;
    var intervalId = setInterval(function() {
      if (playBack <= count) {
        playButton(array[playBack]);
        playBack++;
      } else {
        clearInterval(intervalId);
        playBack = 0;
        userTurn = true;
        return;
      }
    }, wait);
  }

  function runGame(clicked) {
    clicks++;
    playButton(clicked);
    userArray.push(clicked);

    // compare user's click to current count in simon array. if match continue, else endgame.

    if (userArray.toString() !== array.slice(0, clicks).toString()) {
      mistake();
      userArray = [];
      clicks = 0;
    } else {
      if (clicks == count + 1) {
        userTurn = false;
        count++;

        if (count == goal) {
          stopGame();
          return;
        }

        counter.html(count);
        counter.innerHTML = 0;
        playSounds();
        clicks = 0;
        userArray = [];
      }
    }
  }

  strictButton.click(function() {
    if (strict === false) {
      strict = true;
      strictButton.css("background-color", "darkred");
    } else {
      strict = false;
      strictButton.css("background-color", "");
    }
  });

  startButton.click(function() {
    if (userTurn === false) {
      $("#dialogue").html("SIMON");
      userTurn = true;
      startButton.css("background-color", "darkred");
      startText.html("STOP");

      array = createArray();
      playSounds();
    } else {
      stopGame();
    }
  });

  //listens for simon clicks and calls playButton when clicked
  simon.click(function() {
    if (userTurn) {
      runGame($(this).attr("value"));
    }
  });
});

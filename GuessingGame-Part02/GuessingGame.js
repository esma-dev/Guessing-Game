function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype = {
  difference: function(){
    return Math.abs(this.playersGuess - this.winningNumber);
  },
  isLower: function(){
    return this.playersGuess < this.winningNumber
  },
  playersGuessSubmission: function(num){
    this.playersGuess = num;

    if(num < 1 || num > 100 || typeof(num) !== 'number'){
      // $('#title').html('That is an invalid guess.');
      throw 'That is an invalid guess.';
    } else {
      return this.checkGuess();
    }
  },
  checkGuess: function(){
    let guess = this.playersGuess;
    let winNum = this.winningNumber;

    if(guess === winNum){
      $('#player-input, #hint').prop("disabled", true);
      $('#subtitle').html('Hit Reset to play again!');
      return $('#title').html('You Win!');
      // return 'You Win!';
    } else if (this.pastGuesses.indexOf(guess) > -1){
      return $('#title').html('You have already guessed that number.');
      //return 'You have already guessed that number.';
    }

    this.pastGuesses.push(guess);
    $('#guess-list li:nth-child('+ this.pastGuesses.length + ')').text(this.playersGuess);

    if(this.pastGuesses.length < 5){
      let diff = this.difference();

      if(this.isLower()){
        $('#subtitle').text('Guess Higher');
      } else {
        $('#subtitle').text('Guess Lower');
      }

      if(diff < 10){
        return $('#title').html('You\'re very close!');
        //return 'You\'re burning up!';
      } else if(diff < 25){
        return $('#title').html('You\'re close. Kinda.');
        // return 'You\'re lukewarm.';
      } else if(diff < 50){
        return $('#title').html('You\'re a bit far.');
        // return 'You\'re a bit chilly.';
      } else if(diff < 100){
        return $('#title').html('You\'re very far-off!');
        // return 'You\'re ice cold!';
      }
    }

    $('#subtitle').html('Hit Reset to play again!');
    $('#title').html('You Lose. The correct number was: ' + winNum);
    // return 'You Lose.';
  },
  provideHint: function(){
    var hintArr = [this.winningNumber];
    while(hintArr.length < 3){
      hintArr.push(generateWinningNumber());
    }

    return shuffle(hintArr);
  }
}

function generateWinningNumber(){
  var randNum = Math.ceil(Math.random()*101);
  if(randNum === 0){
    return 1;
  } else if(randNum > 100) {
    return 100;
  } else {
    return randNum
  }
}

function shuffle(arr){
  var len = arr.length,
      i, currShuffle;

  while(len){
    i = Math.floor(Math.random() * len--);

    currShuffle = arr[len];
    arr[len] = arr[i];
    arr[i] = currShuffle;
  }

  return arr;
}

function newGame(){
  var newGame = new Game();
  return newGame;
}

function makeAGuess(game){
  var userInput = $('#player-input').val();
  $('#player-input').val('');
  $('')
  var output = game.playersGuessSubmission(Number(userInput));
  console.log(output);
}

$(document).ready(function(){

  let game = new Game();

  $('#submit').on('click', function(){
    makeAGuess(game);
  });

  $('#player-input').keypress(function(event){
    if(event.which === 13){
      makeAGuess(game);
    }
  });

  $('#hint').click(function(){
    var hints = game.provideHint();
    $('#title').text('Think: ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2]);
  });

  $('#reset').click(function(){
    game = new Game();
    $('.guess').text('-');
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100');
    $('#hint, #submit').prop('disabled', false);
  });

});

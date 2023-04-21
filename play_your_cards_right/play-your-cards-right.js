// Define the initial variables
var suits = ['\u2665', '\u2666', '\u2663', '\u2660'];
var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var cards = [];
var dealtCards = [];
for (var i = 0; i < suits.length; i++) {
  for (var j = 0; j < ranks.length; j++) {
    cards.push(ranks[j] + suits[i]);
  }
}
var currentCard = null;
var nextCard = null;
var score = 0;

// Shuffle the cards
function shuffleCards() {
  for (var i = cards.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
}

// Deal the first card and update the UI
function dealFirstCard() {
  currentCard = cards.shift();
  dealtCards.push(currentCard);
  document.getElementById('card').innerHTML = currentCard;
  if (currentCard.includes('\u2665') || currentCard.includes('\u2666')) {
    document.getElementById('card').style.color = 'red';
  } else {
    document.getElementById('card').style.color = 'black';
  }
}

// Deal the next card and check if it's higher or lower
function dealNextCard(isHigher) {
  nextCard = cards.shift();
  dealtCards.push(nextCard);
  if ((isHigher && getValue(nextCard) > getValue(currentCard)) || (!isHigher && getValue(nextCard) < getValue(currentCard))) {
    // If the guess is correct, update the score and show the next card
    score++;
    currentCard = nextCard;
    document.getElementById('card').innerHTML = currentCard;
    if (currentCard.includes('\u2665') || currentCard.includes('\u2666')) {
      document.getElementById('card').style.color = 'red';
    } else {
      document.getElementById('card').style.color = 'black';
    }
    document.getElementById('score').innerHTML = 'Score: ' + score;
  } else {
    // If the guess is incorrect, end the game
    var message = 'You guessed ' + (isHigher ? 'higher' : 'lower') + ' and the card was ' + currentCard + '. The new card is ' + nextCard + '. Your score is ' + score + '.';
    alert(message);
    location.reload();
  }
}

// Get the value of a card
function getValue(card) {
  var value = card.substr(0, card.length - 1);
  if (value == 'J') {
    return 11;
  } else if (value == 'Q') {
    return 12;
  } else if (value == 'K') {
    return 13;
  } else if (value == 'A') {
    return 14;
  } else {
    return parseInt(value);
  }
}

// Shuffle the cards and deal the first card when the page loads
shuffleCards();
dealFirstCard();

// Add event listeners to the buttons
document.getElementById('higher').addEventListener('click', function() {
  dealNextCard(true);
});
document.getElementById('lower').addEventListener('click', function() {
  dealNextCard(false);
});

// Display the score on the main page
document.getElementById('score').innerHTML = 'Score: ' + score;
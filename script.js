// Create deck function
var makeDeck = function () {
  var deck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];
  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];
    console.log("current suit:" + currentSuit);
    var rankCounter = 1;
    while (rankCounter <= 13) {
      console.log("rank:" + rankCounter);
      var cardName = rankCounter;
      if (cardName == 1) {
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
      }
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };
      deck.push(card);
      rankCounter += 1;
    }
    suitIndex += 1;
  }
  return deck;
};

// Shuffle deck function
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

var shuffleCards = function (cards) {
  var currentIndex = 0;
  while (currentIndex < cards.length) {
    var randomIndex = getRandomIndex(cards.length);
    var randomCard = cards[randomIndex];
    var currentCard = cards[currentIndex];
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return cards;
};

//GLobal variables
var GAME_START = "game start";
var GAME_CARDS_DRAWN = "cards are dealt";
var GAME_RESULTS_SHOWN = "results are shown";
var GAME_HIT_OR_STAND = "hit or stand";
var currentGameMode = GAME_START;
var gameDeck = "";
var playerHand = [];
var dealerHand = [];

// Global functions
var createNewDeck = function () {
  var newDeck = makeDeck();
  var shuffledDeck = shuffleCards(newDeck);
  return shuffledDeck;
};

var checkForBlackjack = function (handArray) {
  var playerCardOne = handArray[0];
  var playerCardTwo = handArray[1];
  var isBlackjack = false;
  if (
    (playerCardOne.name == "ace" && playerCardTwo.rank >= 10) ||
    (playerCardOne.rank >= 10 && playerCardTwo.name == "ace")
  ) {
    isBlackjack = true;
  }
  return isBlackjack;
};

var calculateTotalHandValue = function (handArray) {
  var totalHandValue = 0;
  var aceCounter = 0;
  var index = 0;
  while (index < handArray.length) {
    var currentCard = handArray[index];
    if (
      currentCard.name == "jack" ||
      currentCard.name == "king" ||
      currentCard.name == "queen"
    ) {
      totalHandValue = totalHandValue + 10;
    } else if (currentCard.name == "ace") {
      totalHandValue = totalHandValue + 11;
      aceCounter = aceCounter + 1;
    } else {
      totalHandValue = totalHandValue + currentCard.rank;
    }
    index = index + 1;
  }
  index = 0;
  while (index < aceCounter) {
    if (totalHandValue > 21) {
      totalHandValue = totalHandValue - 10;
    }
    index = index + 1;
  }
  return totalHandValue;
};

var displayPlayerAndDealerhands = function (playerHandArray, dealerHandArray) {
  var playerMessage = "Player Hand: <br>";
  var index = 0;
  while (index < playerHandArray.length) {
    playerMessage =
      playerMessage +
      playerHandArray[index].name +
      " of " +
      playerHandArray[index].suit +
      "<br>";
    index = index + 1;
  }
  index = 0;
  var dealerMessage = "Dealer Hand: <br>";
  var index = 0;
  while (index < dealerHandArray.length) {
    dealerMessage =
      dealerMessage +
      dealerHandArray[index].name +
      " of " +
      dealerHandArray[index].suit +
      "<br>";
    index = index + 1;
  }
  return playerMessage + "<br>" + dealerMessage;
};

var displayHandTotalValues = function (playerHandValue, dealerHandValue) {
  var totalHandValueMessage = `<br>Player total hand value: ${playerHandValue} <br>Dealer total hand value: ${dealerHandValue}`;
  return totalHandValueMessage;
};

var main = function (input) {
  var myOutputValue = "";
  if (currentGameMode == GAME_START) {
    // Create New Deck
    gameDeck = createNewDeck();
    // Deal two cards each to player and dealer
    playerHand.push(gameDeck.pop());
    playerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    dealerHand.push(gameDeck.pop());
    // Update game mode
    currentGameMode = GAME_CARDS_DRAWN;
    myOutputValue = `${displayPlayerAndDealerhands(
      playerHand,
      dealerHand
    )} <br> Enter "hit or "stand".`;
  }
  if (currentGameMode == GAME_CARDS_DRAWN) {
    var playerHasBlackjack = checkForBlackjack(playerHand);
    var dealerHasBlackjack = checkForBlackjack(dealerHand);
    if (playerHasBlackjack == true || dealerHasBlackjack == true) {
      if ((playerHasBlackjack == true) & (dealerHasBlackjack == true)) {
        myOutputValue =
          displayPlayerAndDealerhands(playerHand, dealerHand) +
          "Its a tie! " +
          displayHandTotalValues(playerTotalHandValue, dealerTotalHandValue);
      } else if (playerHasBlackjack == true && dealerHasBlackjack == false) {
        myOutputValue =
          displayPlayerAndDealerhands(playerHand, dealerHand) +
          "Player wins by blackjack! " +
          displayHandTotalValues(playerTotalHandValue, dealerTotalHandValue);
      } else {
        myOutputValue =
          displayPlayerAndDealerhands(playerHand, dealerHand) +
          "Dealer wins by blackjack! " +
          displayHandTotalValues(playerTotalHandValue, dealerTotalHandValue);
      }
    }
    currentGameMode = GAME_HIT_OR_STAND;
    return myOutputValue;
  }
  if (currentGameMode == GAME_HIT_OR_STAND) {
    if (input == "hit") {
      playerHand.push(gameDeck.pop());
      myOutputValue =
        displayPlayerAndDealerhands(playerHand, dealerHand) +
        `<br> You have just drawn another card. Please input "hit" or "stand".`;
    } else if (input == "stand") {
      var playerTotalHandValue = calculateTotalHandValue(playerHand);
      var dealerTotalHandValue = calculateTotalHandValue(dealerHand);
      while (dealerTotalHandValue < 17) {
        dealerHand.push(gameDeck.pop());
        dealerTotalHandValue = calculateTotalHandValue(dealerHand);
      }
      if (
        playerTotalHandValue == dealerTotalHandValue ||
        (playerTotalHandValue > 21 && dealerTotalHandValue > 21)
      ) {
        myOutputValue =
          displayPlayerAndDealerhands(playerHand, dealerHand) +
          "Its a tie! " +
          displayHandTotalValues(playerTotalHandValue, dealerTotalHandValue);
      } else if (
        (playerTotalHandValue > dealerTotalHandValue &&
          playerTotalHandValue <= 21) ||
        (playerTotalHandValue <= 21 && dealerTotalHandValue > 21)
      ) {
        myOutputValue =
          displayPlayerAndDealerhands(playerHand, dealerHand) +
          "Player wins! " +
          displayHandTotalValues(playerTotalHandValue, dealerTotalHandValue);
      } else {
        myOutputValue =
          displayPlayerAndDealerhands(playerHand, dealerHand) +
          "Dealer wins! " +
          displayHandTotalValues(playerTotalHandValue, dealerTotalHandValue);
      }
    } else {
      myOutputValue = `Wrong input - please enter only "hit" or "stand". ${displayPlayerAndDealerhands(
        playerHand,
        dealerHand
      )}`;
    }
    return myOutputValue;
  }
};

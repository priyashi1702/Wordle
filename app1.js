// Word banks
import { words } from './words.js';

import { accessibilityWords } from './accessibility-words.js';

// Get the modal and close button
var modal = document.getElementById('info-modal');
var closeButton = document.querySelector('.close');
var infoButton = document.querySelector('.info-btn');

// Show the modal when the "Info" button is clicked
infoButton.addEventListener('click', function () {
    modal.style.display = 'flex';
});

// Hide the modal when the "close" button is clicked
closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
});

// Hide the modal when clicking outside of the modal content
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});



// Function to get a random word from the accessibility list
var randomWord = function () {
    var randomIndex = Math.floor(Math.random() * accessibilityWords.length);
    return accessibilityWords[randomIndex];
};

var correctWordData = randomWord();  // Get the word and its fact
var correctWord = correctWordData.word.toLowerCase();  // Get the correct word only

var guessedWord = "";
var idx = 0;
var guess = 0;
var buttons = document.querySelectorAll("button");
var alertBox = document.querySelector(".alert");
var newGame = document.querySelector(".new");

// Disable buttons after the game ends
var disableButtons = function () {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
};

// Function to check if a word is valid
function includes(word, words) {
    for (var i = 0; i < words.length; i++) {
        if (word === words[i])
            return true;
    }
    return false;
}

// Button click event listener
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (e) {
        var target = e.target;
        var letter = target.innerText;
        if (letter === 'Clear') {
            if (idx > 0 && guess < 6) {
                idx--;
                var letterDiv = document.querySelector(".character_" + guess + idx);
                letterDiv.innerHTML = "";
                letterDiv.classList.toggle("scale");
                guessedWord = guessedWord.slice(0, idx);
            }
        }
        else if (letter === 'Enter') {
            if (idx == correctWord.length) {
                if (!includes(guessedWord.toLowerCase(), words)) {
                    alertBox.classList.toggle('active');
                    alertBox.innerHTML = "Word not in the list!";
                    setTimeout(function () {
                        alertBox.classList.toggle('active');
                    }, 2000);
                } else {
                    var match = [0, 0, 0, 0, 0]; // 1 => match, 0 => not match, 2 => present
                    guessedWord = guessedWord.toLowerCase();

                    // Match letters with the correct word
                    for (var i_1 = 0; i_1 < correctWord.length; i_1++) {
                        if (guessedWord[i_1] === correctWord[i_1]) {
                            match[i_1] = 1;
                        }
                    }

                    var map = {};
                    for (var i_2 = 0; i_2 < correctWord.length; i_2++) {
                        if (match[i_2] !== 1) {
                            if (map[correctWord[i_2]]) {
                                map[correctWord[i_2]]++;
                            } else {
                                map[correctWord[i_2]] = 1;
                            }
                        }
                    }

                    for (var i_3 = 0; i_3 < guessedWord.length; i_3++) {
                        if (match[i_3] !== 1 && map[guessedWord[i_3]]) {
                            match[i_3] = 2;
                            map[guessedWord[i_3]]--;
                        }
                    }

                    // Update letter tiles and buttons
                    for (var i_4 = 0; i_4 < correctWord.length; i_4++) {
                        var letterDiv = document.querySelector(".character_" + guess + i_4);
                        var button = document.querySelector("#" + guessedWord[i_4].toUpperCase());
                        if (match[i_4] === 0) {
                            letterDiv.classList.add("incorrect");
                            button.classList.add("incorrect");
                        } else if (match[i_4] === 1) {
                            letterDiv.classList.add("correct");
                            button.classList.add("correct");
                        } else if (match[i_4] === 2) {
                            letterDiv.classList.add("present");
                            button.classList.add("present");
                        }
                    }

                    // Check if the game is won
                    if (guessedWord === correctWord) {
                        alertBox.classList.toggle('active');
                        alertBox.innerHTML = `
    <div style="text-align: center; padding: 20px;">
        <h2 style="color: #4CAF50; font-size: 24px; margin-bottom: 10px;">Congrats! You won!</h2>
        <p style="font-size: 18px; font-weight: bold; color: #ff9900;">The word was: ${correctWord.toUpperCase()}</p>
        <p style="font-size: 16px; margin-top: 20px;">Fact: <span style="color: #2196F3;">${correctWordData.fact}</span></p>
    </div>
`;

                        setTimeout(function () {
                            alertBox.classList.toggle('active');
                        }, 5000);
                        disableButtons();
                        newGame.style.display = "block";
                        newGame.addEventListener("click", function () {
                            window.location.reload();
                        });
                    }
                    // Check if the game is lost
                    else if (guess === 5) {
                        alertBox.classList.toggle('active');
                        alertBox.innerHTML = `
    <div style="text-align: center; padding: 20px;">
        <h2 style="color: red; font-size: 24px; margin-bottom: 10px;">Sorry! You lost!</h2>
        <p style="font-size: 18px;">The word was: <span style="font-weight: bold; color: #ff9900;">${correctWord.toUpperCase()}</span></p>
        <p style="font-size: 16px; margin-top: 20px;">Fact: <span style="color: #4CAF50;">${correctWordData.fact}</span></p>
    </div>
`;

                        setTimeout(function () {
                            alertBox.classList.toggle('active');
                        }, 10000);
                        disableButtons();
                        newGame.style.display = "block";
                        newGame.addEventListener("click", function () {
                            window.location.reload();
                        });
                        return;
                    }

                    guess++;
                    idx = 0;
                    guessedWord = "";
                }
            }
        } else if (idx < correctWord.length) {
            guessedWord += letter;
            var letterDiv = document.querySelector(".character_" + guess + idx);
            letterDiv.innerHTML = letter;
            letterDiv.classList.toggle("scale");
            idx++;
        }
    });
}

// Keyboard event listener
document.addEventListener("keydown", function (e) {
    if (e.key === 'Backspace') {
        var button = document.querySelector("#clear");
        button.click();
    } else if (e.key === 'Enter') {
        var button = document.querySelector("#enter");
        button.click();
    } else if (e.key.match(/[a-z]/i)) {
        var button = document.querySelector("#" + e.key.toUpperCase());
        button.click();
    }
});

// Modal functionality


// [Rest of your existing game logic below...]



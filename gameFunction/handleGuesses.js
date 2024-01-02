const canvas = require("../utils/canvas.js");

const { AttachmentBuilder } = require("discord.js");

// matches correct word and guessed word and shows final result
function handleGuesses(e, guessedWordArr,letterStateArr, pickedWord, triesLeft){
	
	// matches each letter and sets their color in colorArr based of conditions
	for(let i=0; i<guessedWordArr.length; i++){

		// when game starts the guessedWordArr is empty
		// this causes error when doing guessedWordArr[i].length
		// hence we break loop to avoid that error
		if(!guessedWordArr[i]) break;
		
		for(let j=0; j<guessedWordArr[i].length; j++){

			// letter state is correct if correct letter in correct position
			if(guessedWordArr[i][j] === pickedWord[j]){
				letterStateArr[i][j] = "correct_letter";
			}
			// letter state is incorrectly positioned if correct letter in wrong place
			else if(pickedWord.includes(guessedWordArr[i][j])){
				letterStateArr[i][j] = "incorrect_position";
			}
			// letter state is incorrect if wrong letter
			else{
				letterStateArr[i][j] = "incorrect_letter";
			}
		}
	}

	const buffer = canvas(5, 8, guessedWordArr, letterStateArr, triesLeft);
	
	const file = new AttachmentBuilder(buffer, './test.png');

	e.channel.send({ files: [file] });
}

module.exports = handleGuesses;

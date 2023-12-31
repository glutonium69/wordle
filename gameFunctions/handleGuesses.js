const getCodeBlock = require("../utils/getCodeBlock.js");
const makeEmbed = require("../utils/makeEmbed.js");
// matches correct word and guessed word and shows final result
function handleGuesses(e, guessedWord, guessedWordArr, pickedWord){
	// color arr holds the color data for all the letters of the guessed word
	let colorArr = [];
	// matches each letter and sets their color in colorArr based of conditions
	for(let i=0; i<guessedWord.length; i++){
		// color green if correct letter in correct position
		if(guessedWord[i] === pickedWord[i]){
			colorArr.push("green");
		}
		// color orange if correct letter in wrong place
		else if(pickedWord.includes(guessedWord[i])){
			colorArr.push("orange");
		}
		// color white if wrong letter
		else{
			colorArr.push("white");
		}
	}

	const CODE_BLOCK = getCodeBlock(guessedWord , guessedWordArr, colorArr);
	const EMBED = makeEmbed(CODE_BLOCK, triesLeft);
	e.channel.send({embeds: [EMBED]});
}

module.exports = handleGuesses;

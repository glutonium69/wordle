const getCodeBlock = require("../utils/getCodeBlock.js");
const makeEmbed = require("../utils/makeEmbed.js");
// matches correct word and guessed word and shows final result
function handleGuesses(e, guessedWord, pickedWord, triesLeft, gameFinished = false){

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

	const CODE_BLOCK = getCodeBlock(guessedWord , colorArr, triesLeft, gameFinished);
	const EMBED = makeEmbed(CODE_BLOCK, triesLeft);
	e.channel.send({embeds: [EMBED]});
	
	if(gameFinished){
		colorArr = [];
	}
}

module.exports = handleGuesses;

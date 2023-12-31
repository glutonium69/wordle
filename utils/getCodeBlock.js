const colorLetters = require("./colorLetters.js");
const setCodeBlock = require("./setCodeBlock.js");

function getCodeBlock(word, guessedWordArr, colorArr){
	
	const COLORED_WORD = colorLetters(word, colorArr);
	guessedWordArr.push(COLORED_WORD);
	const CODE_BLOCK = setCodeBlock(guessedWordArr);
	return CODE_BLOCK;
}

module.exports = getCodeBlock;

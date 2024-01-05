import fetchWord from "../api/fetchWord.js";
import isValid from "../api/isValid.js";
import handleGuesses from "./handleGuesses.js";

async function getWord(wordLength){
	
	let word = "";
	let attempts = 0;
	let maxAttempts = 10;

	// there are cases where the words returned by the fetch() has no definitions according to isValid()
	// the loop makes sure that the word returned the fetcWord() is valid according to isValid()
	// so later we can always show a definition for that word
	do{
		word = await fetchWord(wordLength);
		attempts++;

		if(attempts >= maxAttempts){
			break;
		}
	}while( !(( await isValid(word) ).valid) )
	
	return word;
}

export default async function setGame(e, guessedWordArr, letterStateArr, triesLeft, wordLength){
	e.reply("Starting game...");
	
	const PICKED_WORD = await getWord(wordLength);
	if(PICKED_WORD === "Error") return PICKED_WORD;
	
	handleGuesses(
		e,
		guessedWordArr,
		letterStateArr,
		PICKED_WORD,
		triesLeft
	);
	
	return PICKED_WORD.toLowerCase();
}
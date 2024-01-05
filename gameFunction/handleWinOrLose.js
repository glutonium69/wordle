import handleGuesses from "./handleGuesses.js";

function wordAndDefinition(word, definition){
	// when sending message it'll be like the following
	/*
		```
		word: <word>
		definition: <definition>
		````
	*/
	return `\`\`\`\nWord: ${word}\nDefinition: ${definition}\n\`\`\``;
}

export function handleWin(e, guessedWordArr, letterStateArr, PICKED_WORD, triesLeft, PICKED_WORD_DEFINITION){
	e.channel.send("Congrats!!");
	e.channel.send(wordAndDefinition(PICKED_WORD, PICKED_WORD_DEFINITION));
	handleGuesses(
		e,
		guessedWordArr,
		letterStateArr,
		PICKED_WORD,
		triesLeft
	);
}

export function handleLoose(e, guessedWordArr, letterStateArr, PICKED_WORD, triesLeft, PICKED_WORD_DEFINITION){
	handleGuesses(
		e,
		guessedWordArr,
		letterStateArr,
		PICKED_WORD,
		triesLeft
	);
	e.channel.send("Better luck next time!");
	e.channel.send(wordAndDefinition(PICKED_WORD, PICKED_WORD_DEFINITION));
}
const handleGuesses = require("./handleGuesses");


function wordAndDefinition(word, definition){
	// when sending message to discord it'll be like the following
	/*
		```
		word: <word>
		definition: <definition>
		````
	*/
	return `\`\`\`\nWord: ${word}\nDefinition: ${definition}\n\`\`\``;
}


function handleWin(e, guessedWord, guessedWordArr, pickedWord, triesLeft, definition){
	e.channel.send("Congrats!!");
	e.channel.send(wordAndDefinition(pickedWord, definition));
	handleGuesses(e, guessedWord, guessedWordArr, pickedWord, triesLeft);
}

function handleLoose(e, guessedWord, guessedWordArr, pickedWord, triesLeft, definition){
	handleGuesses(e, guessedWord, guessedWordArr, pickedWord, triesLeft);
	e.channel.send("Better luck next time!");
	e.channel.send( wordAndDefinition(pickedWord, definition) );
}

module.exports = { handleWin, handleLoose }

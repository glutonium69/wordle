const getANSIcode = require("./getANSIcode.js");
// function that takes a word and an array of string of colors that define what color each individual letters will be
// returns a string where each letter of the word is wrapped around with ANSI code for different color based on the array
function colorLetters(word, colorArr){
	word = word.toUpperCase();
	let letterArr = word.split("");
	// passes each letter to getANSIcode(), which returns ANSI code for each letter for their defined color
	let coloredLettersArr = letterArr.map((letter, idx) => getANSIcode(letter, colorArr[idx]));
	let coloredWord = coloredLettersArr.join(" ");
	return coloredWord;
}

module.exports = colorLetters;

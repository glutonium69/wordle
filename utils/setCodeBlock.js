// recieves an array of all the words player guessed and returns them all in a code block with some slyling
function setCodeBlock(guessedWordsArr){
	
	let text = "";
	guessedWordsArr.forEach((word) => {
		// styles each word by putting some space at the beginnning and end(\t) and each word in a new line(\n)
		text += `|\t${word}\t|\n`;
	});

// this particular code is unindented cause this will be sent to discord as a message
//  and since i am using string literals the spaces added as indentation will also be accounted for when sending the message
// thus it'll ruin the structure of the code block
// in this case the following string would look like this when sent to discord
/* 
```ansi
  \u001b[0;0m \u001b[1;31m< This is just ANSI code for coloring letters >
```
*/
  return`
\`\`\`ansi
${text}
\`\`\`
`
}

module.exports = setCodeBlock;

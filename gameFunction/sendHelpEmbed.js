const { PREFIX } = require("../utils/prefix&command");
const { EmbedBuilder } = require("discord.js");
// this is written in md since discord allows md
const helpDescription = `
# PREFIX = "\`${PREFIX}\`"
> Welcome to the Wordle Bot! Here are the commands you can use:

## __Commands__

- To start a new game, type: \` ${PREFIX}wordle \`.
    	- This command will only work once a game ends.

- To make a guess, type: \` ${PREFIX}<your guess> \`.
	- The prefix needed to distinguish between normal text and guesses.

- To end the game, type: \` ${PREFIX}end \`
	- This command can be used to end the game at any point when a game is on going.

## __Color definitions__

> Letters of each guessed word will be in a color-coded tile if your guess is valid:

> If not a valid word then the bot will notify

- :green_square: Green tiles indicate a correct letter in the correct position.
- :yellow_square: Yellow tiles indicate a correct letter but in the wrong position.
- :white_large_square: White tiles indicate an incorrect letter
`;


const helpEmbed = new EmbedBuilder()
	.setTitle("Wordle Bot Help")
	.setDescription(helpDescription)
	.setColor("#03b1fc")
	.setFooter({text: "Good luck and have fun playing!"})


function sendHelpEmbed(channel){
	channel.send({embeds: [helpEmbed]});
}

module.exports =  sendHelpEmbed;

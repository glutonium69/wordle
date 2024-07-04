import { COMMANDS, PREFIX } from "../utils/prefix&command.js";
import { EmbedBuilder, Interaction, CacheType, Message } from "discord.js";
// this is written in md since discord allows md
const helpDescription = `
# PREFIX = "\`${PREFIX}\`"
> Welcome to the Wordle Bot! Here are the info you need:


## __About__
Wordle is a word game where a random word of a certain length is picked and the player has to guess that word within a specific amount of tries. With each guess, if the guessed word is valid (as in if it is a legitamate word according to the dictionary) the word shows up in the board and letters are shown in different colors where each color gives a hint about that letter (check color definition section to learn more about these colors). The player based on those hints and with the power of their volabulary, are to guess the correct word.

## __Commands__

- To start a new game, type: \` ${COMMANDS.start} \`.
  - This command will only work once a game ends.
  - **_Optional Parameters_**
    - You can give optional parameters alongside the start command
    - This is how you do it \` ${COMMANDS.start} [parameter-1, parameter-2] \`
      - **Parameter-1** : Length of the word \` [4 <= value <= 8] \`
      - **Parameter-2** : Total amount of tries \` [3 <= value <= 12] \`

- To make a guess, type: \` ${PREFIX}<your guess> \`.
	- The prefix needed to distinguish between normal text and guesses.

- To end the game, type: \` ${COMMANDS.end} \`
	- This command can be used to end the game at any point when a game is on going.

## __Color definitions__

> Letters of each guessed word will be in a color-coded tile if your guess is valid:

> If not a valid word then the bot will notify

- :green_square: Green tiles indicate a correct letter in the correct position.
- :yellow_square: Yellow tiles indicate a correct letter but in the wrong position.
- :black_large_square: Black tiles indicate an incorrect letter
`;


const helpEmbed = new EmbedBuilder()
	.setTitle("Wordle Bot Help")
	.setDescription(helpDescription)
	.setColor("#03b1fc")
	.setFooter({ text: "Good luck and have fun playing!" })


export default function sendHelpEmbed(channel: Message<boolean>["channel"] | Interaction<CacheType>["channel"]) {
	channel?.send({ embeds: [helpEmbed] });
}
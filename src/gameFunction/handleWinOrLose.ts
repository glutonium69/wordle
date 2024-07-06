import { CacheType, Interaction, Message, CommandInteraction } from "discord.js";
import handleGuesses from "./handleGuesses";
import { TileColor } from "../utils/enums";

function wordAndDefinition(word: string, definition: string) {
	// when sending message it'll be like the following
	/*
		```
		word: <word>
		definition: <definition>
		````
	*/
	return `\`\`\`\nWord: ${word}\nDefinition: ${definition}\n\`\`\``;
}

export default function handleWinOrLoss(
	e: Message<boolean> | Interaction<CacheType>,
	guessedWordArr: string[],
	letterStateArr: TileColor[][],
	PICKED_WORD: string,
	triesLeft: number,
	PICKED_WORD_DEFINITION: string
): { win: () => void, loss: () => void } {

	handleGuesses(
		e,
		guessedWordArr,
		letterStateArr,
		PICKED_WORD,
		triesLeft
	);

	if (e instanceof CommandInteraction) {
		if (!e.replied && !e.deferred) {
			e.reply(wordAndDefinition(PICKED_WORD, PICKED_WORD_DEFINITION));
		} else if (e.replied) {
			e.followUp(wordAndDefinition(PICKED_WORD, PICKED_WORD_DEFINITION));
		}
	} else if (e instanceof Message) {
		e.channel.send(wordAndDefinition(PICKED_WORD, PICKED_WORD_DEFINITION));
	}

	return {
		win: () => {
			if (e instanceof Message) e.reply("Congrats!!");
			else if (e instanceof CommandInteraction) {
				if (!e.replied && !e.deferred) {
					e.reply("Congrats!!");
				} else if (e.replied) {
					e.followUp("Congrats!!");
				}
			}
		},
		loss: () => {
			if (e instanceof Message) e.reply("Better luck next time!");
			else if (e instanceof CommandInteraction) {
				if (!e.replied && !e.deferred) {
					e.reply("Better luck next time!");
				} else if (e.replied) {
					e.followUp("Better luck next time!");
				}
			}
		}
	}
}
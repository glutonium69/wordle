import { Message, Interaction, CacheType, CommandInteraction } from "discord.js";
import fetchWord from "../api/fetchWord";
import isValid from "../api/isValid";
import handleGuesses from "./handleGuesses";
import { TileColor } from "../utils/enums";

async function getWord(wordLength: number): Promise<{ valid: boolean, word: string, definition: string } | null> {

	let word: { valid: boolean, word: string, definition: string } | string | null = null;
	let attempts = 0;
	let maxAttempts = 10;

	// there are cases where the words returned by the fetch() has no definitions according to isValid()
	// the loop makes sure that the word returned the fetcWord() is valid according to isValid()
	// so later we can always show a definition for that word
	do {
		word = (await fetchWord(wordLength));

		if (word === null) {
			attempts++;
			continue;
		}

		word = await isValid(word);

		attempts++;

		if (attempts >= maxAttempts) {
			break;
		}
	} while (word === null || !word.valid)

	return word;
}

export default async function setGame(
	e: Message<boolean> | Interaction<CacheType>,
	guessedWordArr: string[],
	letterStateArr: TileColor[][],
	triesLeft: number,
	wordLength: number,
	keyboardState: {
		correct: string[],
		incorrect: string[],
		wrongPos: string[]
	}
): Promise<{ valid: boolean, word: string, definition: string } | null> {

	if (e instanceof Message)
		e.reply("Starting game...");
	else if (e instanceof CommandInteraction)
		e.reply("Starting game...");

	const PICKED_WORD = await getWord(wordLength);

	if (PICKED_WORD === null) {
		return null;
	}

	handleGuesses(
		e,
		guessedWordArr,
		letterStateArr,
		PICKED_WORD.word,
		triesLeft,
		keyboardState
	);

	return PICKED_WORD;
}
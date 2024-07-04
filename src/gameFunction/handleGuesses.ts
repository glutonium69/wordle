import canvas from "../utils/canvas";
import { TileColor } from "../utils/enums";

import { AttachmentBuilder, CacheType, CommandInteraction, Interaction, Message } from "discord.js";

// matches correct word and guessed word and shows final result
export default function handleGuesses(
	e: Message<boolean> | Interaction<CacheType>,
	guessedWordArr: string[],
	letterStateArr: TileColor[][],
	pickedWord: string,
	triesLeft: number
) {

	// matches each letter and sets their color in colorArr based of conditions
	for (let i = 0; i < guessedWordArr.length; i++) {

		// when game starts the guessedWordArr is empty
		// this causes error when doing guessedWordArr[i].length
		// hence we break loop to avoid that error
		if (!guessedWordArr[i]) break;

		for (let j = 0; j < guessedWordArr[i].length; j++) {

			// letter state is correct if correct letter in correct position
			if (pickedWord && guessedWordArr[i][j] === pickedWord[j]) {
				letterStateArr[i][j] = TileColor.correct_letter;
			}
			// letter state is incorrectly positioned if correct letter in wrong place
			else if (pickedWord && pickedWord.includes(guessedWordArr[i][j])) {
				letterStateArr[i][j] = TileColor.incorrect_position;
			}
			// letter state is incorrect if wrong letter
			else {
				letterStateArr[i][j] = TileColor.incorrect_letter;
			}
		}
	}

	const buffer: Buffer = canvas(
		pickedWord.length,
		letterStateArr.length,
		guessedWordArr,
		letterStateArr,
		triesLeft
	);

	const file = new AttachmentBuilder(buffer);

	if (e instanceof Message)
		e.channel.send({ files: [file] });
	else if (e instanceof CommandInteraction)
		e.channel!.send({ files: [file] });
}
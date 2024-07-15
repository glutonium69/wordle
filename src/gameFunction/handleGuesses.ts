import drawBoard from "../utils/drawBoard";
import drawKeyboard from "../utils/drawKeyboard";
import { TileColor } from "../utils/enums";

import { AttachmentBuilder, CacheType, CommandInteraction, Interaction, Message } from "discord.js";

// matches correct word and guessed word and shows final result
export default function handleGuesses(
	e: Message<boolean> | Interaction<CacheType>,
	guessedWordArr: string[],
	letterStateArr: TileColor[][],
	pickedWord: string,
	triesLeft: number,
	keyboardState: {
		correct: string[],
		incorrect: string[],
		wrongPos: string[]
	}
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

				if (guessedWordArr[i][j] && !keyboardState.correct.includes(guessedWordArr[i][j]))
					keyboardState.correct.push(guessedWordArr[i][j])
			}
			// letter state is incorrectly positioned if correct letter in wrong place
			else if (pickedWord && pickedWord.includes(guessedWordArr[i][j])) {
				letterStateArr[i][j] = TileColor.incorrect_position;

				if (guessedWordArr[i][j] && !keyboardState.wrongPos.includes(guessedWordArr[i][j]))
					keyboardState.wrongPos.push(guessedWordArr[i][j])
			}
			// letter state is incorrect if wrong letter
			else {
				letterStateArr[i][j] = TileColor.incorrect_letter;

				if (guessedWordArr[i][j] && !keyboardState.incorrect.includes(guessedWordArr[i][j]))
					keyboardState.incorrect.push(guessedWordArr[i][j])
			}
		}
	}


	const boardBuffer: Buffer = drawBoard(
		pickedWord.length,
		letterStateArr.length,
		guessedWordArr,
		letterStateArr,
		triesLeft
	);
	const keyboardBuffer: Buffer = drawKeyboard(keyboardState);

	const boardImg = new AttachmentBuilder(boardBuffer);
	const keyboardImg = new AttachmentBuilder(keyboardBuffer);

	if (e instanceof Message) {
		e.channel.send({ files: [boardImg] });
		e.channel.send({ files: [keyboardImg] });
	}
	else if (e instanceof CommandInteraction) {
		e.channel!.send({ files: [boardImg] });
		e.channel!.send({ files: [keyboardImg] });
	}
}
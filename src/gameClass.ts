import { Message, Interaction, CommandInteraction, CacheType } from "discord.js"
import { COMMANDS, PREFIX } from "./utils/prefix&command";
import handleGuesses from "./gameFunction/handleGuesses";
import handleWinOrLoss from "./gameFunction/handleWinOrLose";
import setGame from "./gameFunction/setGame";
import isValid from "./api/isValid";
import { GAME_STATUS, TileColor } from "./utils/enums";

export const TOTAL_TRIES_DEFAULT = 7;
export const WORD_LENGTH_DEFAULT = 5;
const timeTillBotTurnsOff = 10 * (60 * 1000); // minute -> mili-sec
const optionalParams = {
	wordLength: {
		min: 4,
		max: 8
	},
	totalTries: {
		min: 3,
		max: 12
	}
}

export const gameInstances = new Map();

// this returns an array like [ [],[],[],[],[],[]..... ]
function setLetterStateArr(totalTries: number, wordLength: number): TileColor[][] {

	const array: TileColor[][] = new Array(totalTries);

	for (let i = 0; i < totalTries; i++) {
		array[i] = new Array(wordLength);
	}
	return array;
}

/*
	guessedWordsArr = [
		think,
		these,
		hyped,
		words,
		hello,
		.....
	]

	letterStateArr = [
		---- guessed word-1 ----
		[
			incorrect_letter,    | letter-1 state
			correct_letter,      | letter-2 state
			incorrect_position,  | letter-3 state
			incorrect_position,  | letter-4 state
			incorrect_letter     | letter-5 state
		],

		---- guessed word-2 ----
		[
			incorrect_position, 
			correct_letter, 
			correct_letter, 
			correct_letter, 
			incorrect_letter
		],
		.......
		.......
	]
*/

export default class Wordle {

	e: Message<boolean> | Interaction<CacheType>;
	serverId: string;
	hasGameStarted: boolean;
	PICKED_WORD: string;
	PICKED_WORD_DEFINITION: string;
	GUESSED_WORD: string;
	WORD_LENGTH: number;
	triesLeft: number;
	GUESSED_WORD_ARR: string[];
	LETTER_STATE_ARR: TileColor[][];
	shutDownTimer: NodeJS.Timeout | undefined;
	currentEvent: Message<boolean> | Interaction<CacheType>;

	constructor(e: Message<boolean> | Interaction<CacheType>, serverId: string) {
		this.e = e;
		this.serverId = serverId;
		this.hasGameStarted = false;
		this.PICKED_WORD = "";
		this.PICKED_WORD_DEFINITION = "";
		this.GUESSED_WORD = "";
		this.WORD_LENGTH = WORD_LENGTH_DEFAULT;
		this.triesLeft = TOTAL_TRIES_DEFAULT;
		this.GUESSED_WORD_ARR = [];
		this.LETTER_STATE_ARR = setLetterStateArr(TOTAL_TRIES_DEFAULT, WORD_LENGTH_DEFAULT);
		this.shutDownTimer = undefined;
		this.currentEvent = this.e;
	}

	async initializeStart(): Promise<void> {

		this.e.channel!.send(`Starting a new game of Wordle! Type \`${COMMANDS.help}\` for more info.`);
		// startGame() fetches a word with api call,
		// and makes starting embed and returns the fetched word or "Error" if error occurs
		const fetchedWordInfo = await setGame(
			this.e,
			this.GUESSED_WORD_ARR,
			this.LETTER_STATE_ARR,
			this.triesLeft,
			this.WORD_LENGTH
		);

		if (fetchedWordInfo === null) {
			// stop executing if api doesnt return a word
			this.e.channel?.send("Ooops. The not could not fetch a random word ;--;");
			this.initializeEnding(GAME_STATUS.LOST);
			return;
		}

		this.PICKED_WORD = fetchedWordInfo.word;
		this.GUESSED_WORD = fetchedWordInfo.word;
		this.PICKED_WORD_DEFINITION = fetchedWordInfo.definition;

		this.hasGameStarted = true;

		this.shutDownTimer = setTimeout(() => {
			this.shutDown()
		}, timeTillBotTurnsOff);
	}

	initializeEnding(result: GAME_STATUS | undefined) {

		if (result === GAME_STATUS.WON) {
			handleWinOrLoss(
				this.currentEvent,
				this.GUESSED_WORD_ARR,
				this.LETTER_STATE_ARR,
				this.PICKED_WORD,
				this.triesLeft,
				this.PICKED_WORD_DEFINITION
			).win();
		}
		else if (result === GAME_STATUS.LOST) {
			handleWinOrLoss(
				this.currentEvent,
				this.GUESSED_WORD_ARR,
				this.LETTER_STATE_ARR,
				this.PICKED_WORD,
				this.triesLeft,
				this.PICKED_WORD_DEFINITION
			).loss();
		}

		this.resetVariables();
		clearTimeout(this.shutDownTimer);
		gameInstances.delete(this.serverId);
	}

	resetVariables() {
		this.PICKED_WORD = "";
		this.hasGameStarted = false;
		this.triesLeft = TOTAL_TRIES_DEFAULT;
	}

	shutDown() {
		this.e.channel!.send("The game has ended due to inactivity.");
		this.initializeEnding(undefined);
	}

	resetTimer() {
		// reset the shut down timer
		clearTimeout(this.shutDownTimer);
		this.shutDownTimer = setTimeout(() => {
			this.shutDown()
		}, timeTillBotTurnsOff);
	}

	async game(e: Message<boolean> | Interaction<CacheType>, userMessage: string) {

		// makes sure bot doesn't send nor take command from different channel
		if (this.e.channelId !== e.channelId) {
			return;
		}

		// return if neither game hasn't started nor userMessage includes the start command
		if (!this.hasGameStarted && !userMessage.startsWith(COMMANDS.start)) {
			gameInstances.delete(this.serverId);
			return;
		}

		// makes sure the codes are only ran once when game starts
		if (!this.hasGameStarted && userMessage.startsWith(COMMANDS.start)) {

			// check if optional parameters are given [ word length and total tries ]
			// optional params are given as such "COMMAD.start [word_length, total_tries]"
			const pattern = /\.wordle\s*\[(\d+)\s*,\s*(\d+)\]/;
			const match = pattern.exec(userMessage)

			if (!match) {
				await this.initializeStart();
				return;
			}

			const wordLength = parseInt(match[1], 10);
			const totalTries = parseInt(match[2], 10);

			if (
				(wordLength >= optionalParams.wordLength.min &&
					wordLength <= optionalParams.wordLength.max) &&
				(totalTries >= optionalParams.totalTries.min &&
					totalTries <= optionalParams.totalTries.max)
			) {
				this.WORD_LENGTH = wordLength;
				this.triesLeft = totalTries;
				this.LETTER_STATE_ARR = setLetterStateArr(this.triesLeft, this.WORD_LENGTH);
			}
			else {
				if (this.e instanceof Message)
					this.e.reply(`Invalid parameters. Please use \`${COMMANDS.help}\` for more info.`);
				else if (this.e instanceof CommandInteraction)
					this.e.reply(`Invalid parameters. Please use \`${COMMANDS.help}\` for more info.`);

				gameInstances.delete(this.serverId);
				return;
			}

			await this.initializeStart();
		}

		// stop the game upon stop command
		if (this.hasGameStarted && userMessage === COMMANDS.end) {
			this.initializeEnding(GAME_STATUS.LOST);
			return;
		};

		// early return if the userMessage is the start command itself
		// or if either userMessage didnt start with the prefix
		if (
			userMessage.startsWith(COMMANDS.start) ||
			!userMessage.startsWith(PREFIX)
		) return;

		// remove the prefix from the userMessage thus getting the guessed word
		this.GUESSED_WORD = userMessage.slice(PREFIX.length);

		// notify user if the guessed word isn't of the correct length
		if (this.GUESSED_WORD.length !== this.WORD_LENGTH) {
			const reply = (event: any): void => {
				event.reply(`Guessed words must be ${this.WORD_LENGTH} letters`).then((msg: any) => {
					setTimeout(() => {
						msg.delete();
					}, 5000);
				})
			}

			if (e instanceof Message)
				reply(e);
			else if (e instanceof CommandInteraction)
				reply(e);

			return;
		}

		// check validation for user input as in , is it a valid word.
		// And notify user if not valid
		let validationResult = await isValid(this.GUESSED_WORD);

		if (!validationResult.valid) {

			if (e instanceof Message)
				e.react("❌");

			return;
		}

		this.GUESSED_WORD_ARR.push(this.GUESSED_WORD);
		this.triesLeft--;

		if (this.GUESSED_WORD === this.PICKED_WORD) {
			this.initializeEnding(GAME_STATUS.WON);
			return;
		}

		else if (this.triesLeft === 0) {
			this.initializeEnding(GAME_STATUS.LOST);
			return;
		}

		handleGuesses(
			this.e,
			this.GUESSED_WORD_ARR,
			this.LETTER_STATE_ARR,
			this.PICKED_WORD,
			this.triesLeft
		);

		this.resetTimer()
	}
}

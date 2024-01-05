import Discord from "discord.js";
const client = new Discord.Client({
	intents: ["Guilds", "GuildMessages", "MessageContent"],
});

import listen from "./server.js";
import { COMMANDS, PREFIX } from "./utils/prefix&command.js";
import handleGuesses from "./gameFunction/handleGuesses.js";
import { handleWin, handleLoose } from "./gameFunction/handleWinOrLose.js";
import sendHelpEmbed from "./gameFunction/sendHelpEmbed.js";
import setGame from "./gameFunction/setGame.js";
import isValid from "./api/isValid.js";


client.on("ready", () => {
	console.log("Bot is online with the username: " + client.user.tag);
});

const TOTAL_TRIES_DEFAULT = 7;
const WORD_LENGTH_DEFAULT = 5;
const timeTillBotTurnsOff = 10 * (60 * 1000); // minute -> mili-sec
const gameInstances = new Map();

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


// this returns an array like [ [],[],[],[],[],[]..... ]
function setLetterStateArr(totalTries, wordLength){

	const array = new Array(totalTries);
	
	for(let i = 0; i < totalTries; i++){
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

class Wordle {
	
	constructor(e, serverId){
		this.e = e;
		this.serverId = serverId;
		this.hasGameStarted = false;
		this.PICKED_WORD = undefined;
		this.PICKED_WORD_DEFINITION = undefined;
		this.GUESSED_WORD = undefined;
		this.WORD_LENGTH = WORD_LENGTH_DEFAULT;
		this.triesLeft = TOTAL_TRIES_DEFAULT;
		this.GUESSED_WORD_ARR = [];
		this.LETTER_STATE_ARR = setLetterStateArr(TOTAL_TRIES_DEFAULT, WORD_LENGTH_DEFAULT); 
		this.shutDownTimer = undefined;
	}

	async initializeStart(){
		this.e.channel.send(`Starting a new game of Wordle! Type \`${COMMANDS.help}\` for more info.`);
		// startGame() fetches a word with api call,
		// and makes starting embed and returns the fetched word or "Error" if error occurs
		this.PICKED_WORD = await setGame(
			this.e,
			this.GUESSED_WORD_ARR,
			this.LETTER_STATE_ARR,
			this.triesLeft,
			this.WORD_LENGTH
		);
		
		this.PICKED_WORD_DEFINITION = ( await isValid(this.PICKED_WORD) ).definition;
		this.GUESSED_WORD = this.PICKED_WORD;
		// stop executing if an error occurs from the api call
		if (this.PICKED_WORD === "Error") {
			this.e.reply("Something went wrong! ;-;");
			return;
		}
		this.hasGameStarted = true;

		this.shutDownTimer = setTimeout(() => {
			this.shutDown()
		},timeTillBotTurnsOff);
	}

	initializeEnding(result){
		
		if (result === "won") {
			handleWin(
				this.e,
				this.GUESSED_WORD_ARR,
				this.LETTER_STATE_ARR,
				this.PICKED_WORD,
				this.triesLeft,
				this.PICKED_WORD_DEFINITION
			);
		}
		else{
			handleLoose(
				this.e,
				this.GUESSED_WORD_ARR,
				this.LETTER_STATE_ARR,
				this.PICKED_WORD,
				this.triesLeft,
				this.PICKED_WORD_DEFINITION
			)
		}

		this.resetVariables();
		clearTimeout(this.shutDownTimer);
		gameInstances.delete(this.serverId);
	}

	resetVariables(){
		this.PICKED_WORD = undefined;
		this.hasGameStarted = false;
		this.triesLeft = TOTAL_TRIES_DEFAULT;
	}

	shutDown(){
		this.e.channel.send("The game has ended due to inactivity.");
		this.initializeEnding("lost");
	}

	resetTimer(){
		// reset the shut down timer
		clearTimeout(this.shutDownTimer);
		this.shutDownTimer = setTimeout(() => {
			this.shutDown()
		},timeTillBotTurnsOff);
	}

	async game(e, userMessage, channelId){

		// makes sure bot doesn't send nor take command from different channel
		if(this.e.channelId !== channelId){
			return;
		}

		// return if neither game hasn't started nor userMessage includes the start command
		if (!this.hasGameStarted && !userMessage.startsWith(COMMANDS.start)){
			gameInstances.delete(this.serverId);
			return;
		}
		
		// makes sure the codes are only ran once when game starts
		if (!this.hasGameStarted && userMessage.startsWith(COMMANDS.start)){
			
			// check if optional parameters are given [ word length and total tries ]
			// optional params are given as such "COMMAD.start [word_length, total_tries]"
			const pattern = /\.wordle\s*\[(\d+)\s*,\s*(\d+)\]/;
			const match = pattern.exec(userMessage)
			
			if (!match){
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
			){
				this.WORD_LENGTH = wordLength;
				this.triesLeft = totalTries;
				this.LETTER_STATE_ARR = setLetterStateArr(this.triesLeft, this.WORD_LENGTH);
			}
			else{
				this.e.reply(`Invalid parameters. Please use \`${COMMANDS.help}\` for more info.`);
				gameInstances.delete(this.serverId);
				return;
			}
			
			await this.initializeStart();
		}
		
		// stop the game upon stop command
		if (this.hasGameStarted && userMessage === COMMANDS.end){
			this.initializeEnding("lost");
			return;
		};

		// early return if the userMessage is the start command itself
		// or if either userMessage didnt start with the prefix
		if (
			userMessage.startsWith(COMMANDS.start) ||
			!userMessage.startsWith(PREFIX)
		)return;

		// remove the prefix from the userMessage thus getting the guessed word
		this.GUESSED_WORD = userMessage.slice(PREFIX.length);

		// notify user if the guessed word isn't of the correct length
		if(this.GUESSED_WORD.length !== this.WORD_LENGTH){
			e.reply(`Guessed words must be ${this.WORD_LENGTH} letters`).then(msg => {
				setTimeout(() => {
					msg.delete();
				}, 5000);
			})
			return;
		}
			
		// check validation for user input as in , is it a valid word.
		// And notify user if not valid
		let validationResult = await isValid(this.GUESSED_WORD);

		if (!validationResult.valid) {
			// e.react("❌");
			e.reply("Invalid word! Try again!")
				.then((reply) => {
					// Delete the message and the reply after a certain time
					setTimeout(() => {
						e.delete();
						reply.delete();
					}, 5000);
				});
			return;
		}

		this.GUESSED_WORD_ARR.push(this.GUESSED_WORD);
		this.triesLeft-- ;
		
		if( this.GUESSED_WORD === this.PICKED_WORD ){
			this.initializeEnding("won");
			return;
		}

		else if( this.triesLeft === 0 ){
			this.initializeEnding("lost");
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


client.on("messageCreate", async (e) => {

	if(e.author.bot) return;

	// if(e.content.startsWith(COMMANDS.start)){ 
	// 	e.reply("Bot is temporarily off for maintenance.");
	// 	return;
	// }

	// trim() removes all the white spaces from the beginning and the end keeping the end
	const userMessage = (e.content.trim()).toLowerCase()
	// send help emded if userMessage includes the help command
	if (userMessage === COMMANDS.help){
		sendHelpEmbed(e.channel);
		return;
	}

	
	// get the server id
	const serverId = e.guildId;
	// pass the user message if an instance of the game class exists
	if (gameInstances.has(serverId)) {
		const existingGameInstance = gameInstances.get(serverId);
		await existingGameInstance.game(e, userMessage, e.channelId);
	} 
	// make new game instace for that server if an  instance doesn't exist
	else {
		const newGameInstance = new Wordle(e, serverId);
		gameInstances.set(serverId, newGameInstance);
		await newGameInstance.game(e, userMessage, e.channelId);
	}
});

listen();
const logIn = process.env["TOKEN"];
client.login(logIn);
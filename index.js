const Discord = require("discord.js");
const client = new Discord.Client({
	intents: ["Guilds", "GuildMessages", "MessageContent"],
});

const listen = require("./server.js");
const { COMMANDS, PREFIX } = require("./utils/prefix&command.js");
const handleGuesses = require("./gameFunctions/handleGuesses.js");
const { handleWin, handleLoose 
	  } = require("./gameFunctions/handleWinOrLose.js");
const helpDescriptionEmbed = require("./gameFunctions/helpDescription.js");
const startGame = require("./gameFunctions/startGame.js");
const isValid = require("./api/isValid.js");

client.on("ready", () => {
	console.log("Bot is online with the username: " + client.user.tag);
});

const TOTAL_TRIES = 8;
const timeTillBotTurnsOff = 10 * (60 * 1000); // minute -> mili-sec
const gameInstances = new Map();

class Wordle {
	constructor(e, serverId){
		this.e = e;
		this.serverId = serverId;
		this.hasGameStarted = false;
		this.PICKED_WORD = undefined;
		this.PICKED_WORD_DEFINITION = undefined;
		this.GUESSED_WORD = undefined;
		this.GUESSED_WORD_ARR = [];
		this.shutDownTimer = undefined;
		this.triesLeft = TOTAL_TRIES;
	}

	resetVariables(){
		this.PICKED_WORD = undefined;
		this.hasGameStarted = false;
		this.triesLeft = TOTAL_TRIES;
	}

	shutDown(){
		this.e.channel.send("The game has ended due to inactivity.");
		handleLoose(
			this.e,
			this.GUESSED_WORD,
			this.GUESSED_WORD_ARR,
			this.PICKED_WORD,
			this.triesLeft,
			this.PICKED_WORD_DEFINITION
		);
		this.resetVariables();
		gameInstances.delete(this.serverId);
	}

	async game(message){
		// send help description upon help command
		if ((message.toLowerCase()).startsWith(COMMANDS.help)) {
			this.e.channel.send({embeds: [helpDescriptionEmbed]});
			return;
		}
		// return if neither game hasn't started nor message includes the start command
		if (!this.hasGameStarted && !message.startsWith(COMMANDS.start)) return;
		// makes sure the codes are only ran once when game starts
		if (!this.hasGameStarted) {
			// startGame()  fetches a word with api call,
			// and makes starting embed and returns the fetched word or "Error" if error occurs
			this.PICKED_WORD = await startGame(this.e, TOTAL_TRIES);
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
		// trim() removes any whitespaces from both sides of the message to keep the proper length
		const userMessage = message.trim().toLowerCase();

		// stop the game upon stop command
		if( userMessage === COMMANDS.end && this.hasGameStarted ){
			handleLoose(
				this.e,
				this.GUESSED_WORD,
				this.GUESSED_WORD_ARR,
				this.PICKED_WORD,
				this.triesLeft,
				this.PICKED_WORD_DEFINITION
			)
			this.resetVariables();
			gameInstances.delete(this.serverId);
			return;
		};

		// early return if the userMessage is the start command itself
		// or if either userMessage didnt start with the prefix
		// or the total length of the userMessage is not 6 ( 5 letters + the prefix )
		if (
			userMessage === COMMANDS.start ||
			!userMessage.startsWith(PREFIX) ||
			userMessage.length !== 6
		)return;

		// remove the prefix from the message thus getting the guessed word
		this.GUESSED_WORD = userMessage.slice(PREFIX.length);
		// check validation for user input as in , is it a valid word.
		// And notify user if not valid
		let validationResult = await isValid(this.GUESSED_WORD);

		if (!validationResult.valid) {
			this.e.reply("Invalid word! Try again!");
			return;
		}

		this.triesLeft = this.triesLeft - 1;

		if( this.GUESSED_WORD === this.PICKED_WORD ){
			handleWin(
				this.e,
				this.GUESSED_WORD,
				this.GUESSED_WORD_ARR,
				this.PICKED_WORD,
				this.triesLeft,
				this.PICKED_WORD_DEFINITION
			);
			this.resetVariables();
			clearTimeout(this.shutDownTimer);
			gameInstances.delete(this.serverId);
			return;
		}

		else if( this.triesLeft === 0 ){
			handleLoose(
				this.e,
				this.GUESSED_WORD,
				this.GUESSED_WORD_ARR,
				this.PICKED_WORD,
				this.triesLeft,
				this.PICKED_WORD_DEFINITION
			);
			this.resetVariables();
			clearTimeout(this.shutDownTimer);
			gameInstances.delete(this.serverId);
			return;
		}

		handleGuesses(
			this.e,
			this.GUESSED_WORD,
			this.GUESSED_WORD_ARR,
			this.PICKED_WORD,
			this.triesLeft
		);
		clearTimeout(this.shutDownTimer);
		this.shutDownTimer = setTimeout(() => {
			this.shutDown()
		},timeTillBotTurnsOff);
	}
}


client.on("messageCreate", async (e) => {

	if(e.author.bot) return;
	
	// get the server id
	const serverId = e.guildId;
	// check if a game instance already exists for the server
	if (gameInstances.has(serverId)) {
		const existingGameInstance = gameInstances.get(serverId);
		await existingGameInstance.game(e.content);
	} else {
		const newGameInstance = new Wordle(e, serverId);
		gameInstances.set(serverId, newGameInstance);
		await newGameInstance.game(e.content);
	}
});

listen();
const logIn = process.env["TOKEN"];
client.login(logIn);
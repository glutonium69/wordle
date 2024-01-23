import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

const client = new Client({
	intents: ["Guilds", "GuildMessages", "MessageContent", GatewayIntentBits.Guilds],
});

import listen from "./server.js";
import { COMMANDS } from "./utils/prefix&command.js";
import sendHelpEmbed from "./gameFunction/sendHelpEmbed.js";
import Wordle, { gameInstances, WORD_LENGTH_DEFAULT, TOTAL_TRIES_DEFAULT } from "./gameClass.js";
import "./registerSlash.js";

client.on("ready", () => {
	console.log("Bot is online with the username: " + client.user.tag);
});

async function initializeGame(e, userMessage){

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

}

client.on("messageCreate", async (e) => {

	if(e.author.bot) return;

	// trim() removes all the white spaces from the beginning and the end keeping the end
	const userMessage = (e.content.trim()).toLowerCase()
	// send help emded if userMessage includes the help command
	if (userMessage === COMMANDS.help){
		sendHelpEmbed(e.channel);
		return;
	}

	await initializeGame(e, userMessage)

});

client.on('interactionCreate', async (interaction) => {
	
	if (!interaction.isChatInputCommand()) return;

	switch(interaction.commandName){
		case "start" :
			let wordLength = interaction.options.getInteger("word-length");
			let totalTries = interaction.options.getInteger("total-tries");
			
			wordLength = wordLength ? wordLength : WORD_LENGTH_DEFAULT;
			totalTries = totalTries ? totalTries : TOTAL_TRIES_DEFAULT;

			let userMessage = `${COMMANDS.start} [${wordLength}, ${totalTries}]`;
			
			await initializeGame(interaction, userMessage);
			break;

			
		case "end" :
			await initializeGame(interaction, COMMANDS.end);
			break;

		case "help" :
			sendHelpEmbed(interaction);;
			break;
	}
	
});

listen();

dotenv.config();
const TOKEN = process.env["TOKEN"];
client.login(TOKEN);

import { Client, GatewayIntentBits, Message, Interaction, CacheType } from "discord.js";
import dotenv from "dotenv";

const client = new Client({
	intents: ["Guilds", "GuildMessages", "MessageContent", GatewayIntentBits.Guilds],
});

import listen from "./server";
import { COMMANDS } from "./utils/prefix&command";
import sendHelpEmbed from "./gameFunction/sendHelpEmbed";
import Wordle, { gameInstances, WORD_LENGTH_DEFAULT, TOTAL_TRIES_DEFAULT } from "./gameClass";
import "./registerSlash";

client.on("ready", (): void => {
	console.log("Bot is online with the username: " + client.user!.tag);
});

async function initializeGame(e: Message<boolean> | Interaction<CacheType>, userMessage: string): Promise<void> {

	// get the server id
	const serverId: string = e.guildId ? e.guildId : "";

	if(serverId === ""){
		return;
	}

	

	// pass the user message if an instance of the game class exists
	if (gameInstances.has(serverId)) {
		const existingGameInstance = gameInstances.get(serverId);
		await existingGameInstance.game(e, userMessage, e.channelId);
	}
	// make new game instace for that server if an instance doesn't exist
	else {
		const newGameInstance = new Wordle(e, serverId);
		gameInstances.set(serverId, newGameInstance);
		await newGameInstance.game(e, userMessage);
	}

}

client.on("messageCreate", async (e: Message<boolean>): Promise<void> => {

	if (e.author.bot) return;

	// trim() removes all the white spaces from the beginning and the end keeping the end
	const userMessage: string = (e.content.trim()).toLowerCase()
	// send help emded if userMessage includes the help command
	if (userMessage === COMMANDS.help) {
		sendHelpEmbed(e.channel);
		return;
	}

	await initializeGame(e, userMessage)

});

client.on('interactionCreate', async (interaction): Promise<void> => {

	if (!interaction.isChatInputCommand()) return;

	switch (interaction.commandName) {
		case "start":
			let wordLength: number | null = interaction.options.getInteger("word-length");
			let totalTries: number | null = interaction.options.getInteger("total-tries");

			wordLength = wordLength ? wordLength : WORD_LENGTH_DEFAULT;
			totalTries = totalTries ? totalTries : TOTAL_TRIES_DEFAULT;

			let userMessage: string = `${COMMANDS.start} [${wordLength}, ${totalTries}]`;

			await initializeGame(interaction, userMessage);
			break;

		case "end":
			await initializeGame(interaction, COMMANDS.end);
			break;

		case "help":
			sendHelpEmbed(interaction.channel);
			break;
	}
});

listen();

dotenv.config();
const TOKEN = process.env["TOKEN"];
client.login(TOKEN);
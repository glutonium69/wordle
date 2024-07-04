import { ApplicationCommandOptionType } from "discord.js";

const start = {
	name: 'start',
	description: 'Starts a new game of Wordle',
	options: [
		{
			name: "word-length",
			description: "The length of the word to guess [4 <= value <= 8]",
			type: ApplicationCommandOptionType.Integer
		},
		{
			name: "total-tries",
			description: "The total amout of available guesses [3 <= value <= 12]",
			type: ApplicationCommandOptionType.Integer
		}
	]
}

const end = {
	name: 'end',
	description: 'Ends the current game'
}

const help = {
	name: 'help',
	description: 'Sends nescessary information about the bot',
}

export const commands = [
	start,
	end,
	help
]
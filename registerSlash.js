import { REST, Routes } from 'discord.js';
import { commands } from './slashCommands/commands.js';
import dotenv from "dotenv";
dotenv.config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const APPLICATION_ID = process.env.APPLICATION_ID;

try {	
    await rest.put(Routes.applicationCommands(APPLICATION_ID), {
      body: commands
    });
    console.log('Successfully reloaded application (/) commands.');	
}
catch (error) {
    console.error(error);
}

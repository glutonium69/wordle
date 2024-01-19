import { REST, Routes } from 'discord.js';
import { commands } from './slashCommands/commands.js';

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const APPLICATION_ID = "1190795884389216296";


try {
	
  await rest.put(Routes.applicationCommands(APPLICATION_ID), {
    body: commands
  });
  
	console.log('Successfully reloaded application (/) commands.');	
} 
catch (error) {
	console.error(error);
}

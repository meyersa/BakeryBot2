const fs = require('fs');
const { Client, Intents } = require("discord.js");

/*
*	Bot created by: Meyers#6464
*	Version: 2.0.3
* 	 
*	Imports FS, djs, token, and the config
*	From there it creates the discord client instance
*	Gathers all loaded event listeners
*	Starts listeners and runs single instance events
*	Logs in
*/

const token = require('./config/token.json');
const config = require('./config/config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, config));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, config));
	};
};

client.login(token.token);
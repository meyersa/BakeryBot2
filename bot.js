const fs = require('fs');
const { Client, Intents } = require("discord.js");

const token = process.env.TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));

	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
		
	};
};

client.login(token);
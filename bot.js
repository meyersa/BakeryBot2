const fs = require('fs');
const { Client, Intents } = require("discord.js");
// Const that will probably be needed in commands/handlers
// Collection, MessageEmbed, MessageActionRow, Interaction, Permissions, RoleManager, DiscordAPIError, MessageButton, ButtonInteraction, TextChannel

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
	}
}

client.login(token.token);
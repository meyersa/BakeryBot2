module.exports = {
    name: "messageCreate",
    summary: "MessageCreate event, command handler",
    async execute(message, client, config) {
        if (message.author.bot || !message.content.startsWith(config.prefix)) return;
        // Checks to make sure an actual user is calling command with the prefix 

        var args = message.content.slice(config.prefix.length).trim().match(/\w+|"[^"]+"/g);
        i = args.length;
        while (i--) { args[i] = args[i].replace(/"/g, "") };
        const commandArgs = args.shift().toLowerCase();
        // Splices out command and its arguments

        const fs = require('fs');
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        // Syncs commands available 

        for (const file of commandFiles) {
            if (file.substr(0, file.indexOf(".")) == commandArgs) {
                const command = require(`../commands/${file}`);

                console.log(`${message.author.username} (${message.author.id}) called command "${commandArgs}" in channel ${message.channel.id} of ${message.guild.id}`);
                // Log interaction for debug

                command.execute(args, message, client, config);
            };
        };
        // Command handler
        // Make sure you call arguments in order; args, message, etc even if not being used or it breaks
    }
}
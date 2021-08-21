module.exports = {
    name: "messageCreate",
    summary: "MessageCreate event, command handler",
    async execute(message, client, config) {
        
        /*
        *   Before executing anything, checks to make sure the user isn't a bot and the prefix is the same as the one in the config
        *   From there the initial message is spliced to remove the prefix, the actual command, and the args
        *   The commands are all then loaded using FS
        *   Depending on if the file exists and matches the command, it's then executed in the final for loop
        *   Currently the things passed through are the arguments, the message itself, the client, and the config file
        *   Make sure you use them in order in the execute function or it won't work
        */

        if (message.author.bot || !message.content.startsWith(config.prefix)) return;

        var args = message.content.slice(config.prefix.length).trim().match(/\w+|"[^"]+"/g);
        i = args.length;
        while (i--) { args[i] = args[i].replace(/"/g, "") };
        const commandArgs = args.shift().toLowerCase();

        const fs = require('fs');
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            if (file.substr(0, file.indexOf(".")) == commandArgs) {
                const command = require(`../commands/${file}`);

                console.log(`${message.author.username} (${message.author.id}) called command "${commandArgs}" in channel ${message.channel.id} of ${message.guild.id}`);
                // Log interaction for debug

                command.execute(args, message, client, config);
            };
        };
    },
};
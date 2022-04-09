const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "presenceUpdate",
    summary: "Tracks user status changes.",
    async execute(presenceOld, presenceNew, client) {

        /*
        *   Kinda fucked to make sure it collects the streaming change.
        *   Starts by making sure the new presence exists as well as the the presence being from the right guild.
        * 
        *   If an old presence exists, it checks if you were streaming before. If you were, it returns and quits to prevent false notifs
        *   Now it checks to make sure one of the new presences includes the streaming type and you weren't streaming before
        *   
        *   From there it creates and sends the embed.
        * 
        *   This event should probably be redone to support other events. Perhaps checking through all the activity events for streaming,
        *   then runs the function.
        * 
        */

        if (!presenceNew) return;
        if (!(presenceNew.guild.id == process.env.guildID)) return;

        var streamingOrNot = false;

        if (presenceOld) {
            for (const activity of presenceOld.activities) {
                if (activity.type == "STREAMING") {
                    streamingOrNot = true;

                }
            }
        }

        for (const activity of presenceNew.activities) {
            if (activity.type == "STREAMING" && streamingOrNot == false) {
                const embed = new MessageEmbed()
                    .setColor(process.env.embedColor)
                    .setTitle(`${presenceNew.user.username} is now live on ${activity.name}!`)
                    .setURL(activity.url)
                    .setDescription(`Title: ${activity.details}\nGame: ${activity.state}`)
                    .setThumbnail(presenceNew.user.avatarURL())
                    .setTimestamp();

                await client.channels.cache.get(process.env.welcomeChannel).send({
                    content: `${presenceNew.user}`,
                    embeds: [embed]

                })
                console.log(`Sent a live notification in ${process.env.welcomeChannel} for ${presenceNew.user.username} (${presenceNew.user.id})`);
            
            };
        };
    },
};
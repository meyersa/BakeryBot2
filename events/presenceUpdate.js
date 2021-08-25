const { MessageEmbed } = require("discord.js");
const config = require("../config/config.json");

module.exports = {
    name: "presenceUpdate",
    summary: "Tracks user status changes.",
    async execute(presenceOld, presenceNew, client) {

        if (!presenceNew) return;

        for (const activity of presenceNew.activities) {
            if (activity.type == "STREAMING") {

                /*
                *   Streaming post. Sends embed in Welcome channel (Could easily add another JSON entry for this)
                */

                const embed = new MessageEmbed()
                    .setColor(config.embedColor)
                    .setTitle(`${presenceOld.user.username} is now live on ${activity.name}!`)
                    .setURL(activity.url)
                    .setDescription(`Title: ${activity.details}\nGame: ${activity.state}`)
                    .setThumbnail(presenceNew.user.avatarURL())
                    .setTimestamp();

                await client.channels.cache.get(config.welcomeChannel).send({
                    content: `${presenceNew.user}`,
                    embeds: [embed]
                }).catch((e) => console.error("Failed to send the welcome embed:", e));
            
                console.log(`Sent a live notification in ${config.welcomeChannel} for ${presenceNew.user.username} (${presenceNew.user.id})`);
            };
        };
    },
};
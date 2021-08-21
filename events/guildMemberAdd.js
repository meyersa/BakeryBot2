const config = require("../config/config.json");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "guildMemberAdd",
    summary: "User join messages for now.",
    async execute(member, client) {
        const memberAddEmbed = new MessageEmbed()
            .setTitle("Be sure to welcome them with flours!")
            .setDescription(
            `Be sure to refer to our non existant rules in <#876286652329369620>
            Then be sure to introduce yourself in this channel
            Finally, make sure you tell Jean Mark how stupid he is`
            )
            .setThumbnail(member.user.avatarURL())
            .setTimestamp()
            .setColor(config.embedColor);

        await client.channels.cache.get(config.welcomeChannel).send({
            content: `Welcome! ${member.user}`,
            embeds: [memberAddEmbed]
        });
    },
};
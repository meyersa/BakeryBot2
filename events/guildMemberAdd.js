const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "guildMemberAdd",
    summary: "User join messages for now.",
    async execute(member, client) {

        /* 
        *   Sends an embed join message with a point when a user joins
        *   Currently there is no filter for bots or anything
        *   Possibly a captcha feature could be added in the future
        */

        const memberAddEmbed = new MessageEmbed()
            .setTitle("Be sure to welcome them with flours!")
            .setDescription(
                `Be sure to refer to our non existant rules in <#876286652329369620>
            Then be sure to introduce yourself in this channel
            Finally, make sure you tell Jean Mark how stupid he is`
            )
            .setThumbnail(member.user.avatarURL())
            .setTimestamp()
            .setColor(process.env.embedColor);

        await client.channels.cache.get(process.env.welcomeChannel).send({
            content: `Welcome! ${member.user}`,
            embeds: [memberAddEmbed]
        }).catch((e) => console.error("Failed to send the welcome embed:", e));

        console.log(`Welcomed ${member.user.username} (${member.user.id}) to ${member.guild.id}`)
        
    },
};
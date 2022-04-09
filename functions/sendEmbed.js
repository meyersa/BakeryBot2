const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "sendEmbed",
    execute(message, embedTitle, embedMainBody, embedImage, embedFooter) {
        const embed = new MessageEmbed()
            .setColor(process.env.embedColor)
            .setTimestamp()
            .setTitle(embedTitle)
            .setDescription(embedMainBody)
            .setFooter(embedFooter)
            .setImage(embedImage);

        message.channel.send({ embeds: [embed] }).catch((e) => console.error("Failed to send embed.", e));
        
    },
};
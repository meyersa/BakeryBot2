const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    summary: "Ping command, returns dapi and bot latency in an embed",
    async execute(args, message, client) {

        var embed = new MessageEmbed()
            .setTitle("Pong!")
            .setColor("#77DD77");

        const sendEmbed = await message.channel.send({ embeds: [embed] })
        .catch((e) => console.error("Failed to send ping initial.", e));

        embed.setDescription(`Online with a ping of ${Date.now() - sendEmbed.createdTimestamp}ms\nAPI latency: ${client.ws.ping}ms`);

        await sendEmbed.edit({ embeds: [embed] })
        .catch((e) => console.error("Failed to edit ping embed.", e));

    },
};
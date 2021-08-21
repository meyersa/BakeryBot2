const verifyAdmin = require("../functions/verifyAdmin");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = { 
    name: "InitializeButtons",
    summary: "Initializes the buttons for react role channels",
    async execute(args, message, client) {
        if (!verifyAdmin.execute(message)) return;

            var channel = args[0];
            channel = client.channels.cache.get(channel);

            await channel.bulkDelete(5).catch((error) => console.error("Failed to delete messages. Most likely missing permissions."));

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("reactRoleStart")
                    .setLabel("Create")
                    .setStyle("SUCCESS"),
                new MessageButton().setCustomId("reactRoleDelete").setLabel("Delete").setStyle("DANGER")
            );

            const reactEmbed = new MessageEmbed()
                .setColor("#fde0fd")
                .setTitle("Role Creation")
                .setAuthor("Aidans Bakery")
                .setDescription(
                    "React to make your own role. Press the green button to create a role. Press the red button to delete it. When you create a role the bot will create a thread with you and ask you for a hex color or color name (if found) and then make the role. You can only have one at a time."
                )
                .setFooter("Aidans Bakery");

            await channel
                .send({ embeds: [reactEmbed], components: [row] })
                .catch((e) => console.error("Failed to send embed and buttons.", e));

    }
}
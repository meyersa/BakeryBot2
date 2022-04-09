const { Permissions, MessageEmbed, Message } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    summary: "Recieving button presses.",
    async execute(interaction, client) {

        /* 
        *   Before starting the interaction create, some variables are checked
        *   Initially it's made sure the interaction is a button and that it's a specific button
        *   This can be changed later if more buttons are added
        *   The button is then reset with the defer method
        *   Some basic variables are set
        *   Member roles to see if the user has member roles
        *   Existing channel to see if the user already made a channel
        *   Colorbad is initialized for later use
        *   Then the interaction is filtered on what kind of reaction it recieved
        */

        if (!interaction.isButton() && !(interaction.customId == "reactRoleStart" || interaction.customId == "reactRoleDelete")) return;

        await interaction.deferUpdate();

        const memberRoles = interaction.member._roles;
        const existingChannel = await interaction.guild.channels.cache.find(c => c.name == `${interaction.user.username}-${interaction.user.discriminator}`.toLowerCase())

        allowedRoles = process.env.allowedRoles.split(" ");
        
        for (let i = 0; i < memberRoles.length; i++) {
            for (let n = 0; n < process.env.allowedRoles.length; n++) {
                if (memberRoles[i] == process.env.allowedRoles[n]) {
                    memberRoles.splice(i, 1);
                    i = i - 1;
                }
            }
        }

        if (interaction.customId === "reactRoleStart") {
            if (memberRoles > 0) {

                /* 
                *   If the user has a custom role this will be sent to them
                *   This prevents the user from making multiple custom roles
                */

                var embed = new MessageEmbed()
                    .setTitle("Error! You already have a custom role")
                    .setDescription("In order to create a new role you must click the delete button to clear your existing custom roles")
                    .setFooter(`Sent from ${interaction.guild.name}.`, interaction.guild.iconURL())
                    .setColor(process.env.embedColor)

                await interaction.member
                    .send({ embeds: [embed] })
                    .catch((error) => {
                        console.error(`Unable to DM this user ${interaction.user.id}`, error); // Privacy crash
                    });
                return;


            } else if (existingChannel) {

                /*
                *   If the user already has an open channel this will be sent to them
                *   This prevents the user from continually opening channels
                */

                var embed = new MessageEmbed()
                    .setTitle("Error! You already have an open channel")
                    .setDescription("Please utilize it or wait for it to close before opening a new channel.\nIf you believe this is an error please contact an admin.")
                    .setFooter(`Sent from ${interaction.guild.name}.`, interaction.guild.iconURL())
                    .setColor(process.env.embedColor)

                await interaction.member
                    .send({ embeds: [embed] })
                    .catch((error) => {
                        console.error(`Unable to DM this user ${interaction.user.id}`, error); // Privacy crash
                    });
                return;


            } else if (memberRoles == 0 && !existingChannel) {

                /* 
                *   memberRoles = 0 means user has no custom roles
                *   As such we can make them a channel for role input
                *   The first thing that happens is the permissions for the channel are set
                *   Permissions are allowed for the bot, the user, and denied for everyone role
                *   Then the channel is moved into the correct category
                */
                var desiredRoleColor = "";
                var desiredRoleName = "";

                const channel = await interaction.guild.channels.create(`${interaction.user.username}-${interaction.user.discriminator}`, {
                    permissionOverwrites: [
                        {
                            id: interaction.user.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL],
                        },
                        {
                            id: client.user.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL],
                        },
                        {
                            id: interaction.guild.id,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL],
                        },
                    ],
                }).catch((error) => console.error("Failed to create channel", error.message));

                const channelCategory = await interaction.guild.channels.cache.find(
                    (c) => c.name == process.env.roleCreateCategory);

                await channel.setParent(channelCategory.id, { lockPermissions: false }).catch((error) => console.error("Failed to set channel category", error));

                /* 
                *   Collecting user first input
                *   The first step is to setup the filter to make sure only the original user's messages are collected
                *   A reply embed is then created to send in the channel
                *   Then the first collection, firstRoleCheckCollection is sent
                *   The contents are set as the first field, desiredRoleName
                *   desiredRoleName doesn't cause as many errors as desiredRoleColor, however there is a second catch incase it fails
                */

                const filter = (m) => {
                    return m.author.id == interaction.user.id;
                };

                const firstMessagEmbed = new MessageEmbed()
                    .setTitle("Please enter the name you want your role to be called")
                    .setColor(process.env.embedColor);

                await channel.send({ embeds: [firstMessagEmbed] }).catch((error) => console.error("Failed to send message", error));

                const firstRoleCheckCollection = await channel
                    .awaitMessages({
                        filter,
                        max: 1,
                        time: 300000,
                        errors: ["time"],
                    })
                    .catch((collected) => {
                        channel.delete("role creator timeout");
                    });

                try {
                    desiredRoleName = await firstRoleCheckCollection.first().content;
                }
                catch {
                    console.log(`${interaction.user.username} timed out the function and closed their channel.`)
                    return;
                }

                /* 
                *   Second user input field
                *   This is where the input gets a little more confusing
                *   The DApi allows some color input, or just hex
                *   We do the same thing as before but then run it through a dowhile loop to make sure the color is valid
                *   The only way to determine that though is to try and create the role and see if it failed or not
                */

                const secondMessageEmbed = new MessageEmbed()
                    .setTitle("Please enter the color you want your role to be. This can either be a hex or color name.")
                    .setColor(process.env.embedColor);

                await channel.send({ embeds: [secondMessageEmbed] }).catch((error) => console.error("Failed to send message", error));

                const secondRoleCheckCollection = await channel
                    .awaitMessages({
                        filter,
                        max: 1,
                        time: 300000,
                        errors: ["time"],
                    })
                    .catch((collected) => {
                        channel.delete("role creator timeout");
                    });

                try {
                    desiredRoleColor = await secondRoleCheckCollection.first().content;
                }
                catch {
                    console.log(`${interaction.user.username} timed out the function and closed their channel.`)
                    return;
                }

                /*
                *   Here is the third check
                *   the role is attempted to be created using the first user input
                *   However if it fails because the color is bad it's made again with no color (default grey)
                *   If that fails, we can assume the name of the role is bad and it's errored out and the bot should restart with that logged
                */

                const thirdBadColor = new MessageEmbed()
                    .setTitle("Error. That color doesn't work")
                    .setDescription("The color you entered is either too dark or was unable to be picked up by Discord as a color.\nPlease enter a new color below.")
                    .setColor(process.env.embedColor);

                var createRole = await channel.guild.roles.create({
                    name: desiredRoleName,
                    color: desiredRoleColor.toUpperCase(),
                    reason: interaction.user + "'s Created Role",
                }).catch((error) => console.error(`Failed to create role ${desiredRoleName} for ${interaction.user.username}:`, error.message));

                if (!createRole) {
                    var createRole = await channel.guild.roles.create({
                        name: desiredRoleName,
                        reason: interaction.user + "'s Created Role",
                    }).catch((error) => console.error(`***Role creation failed a second time.*** 
                    {
                        User: ${interaction.user.username} (${interaction.user.id})
                        Role Name: ${desiredRoleName}
                        Role Color: ${desiredRoleColor}
                    }`, error));
                };

                /*
                *   Now for making sure the color input is valid by discord's role creation standards
                *   Discord takes three inputs; color hex, color hex with hashtag, and color name
                *   The name is very subjective though, in order to make sure if it's valid we have to create a role with the color and see if it fails or not
                *   We already tried to make the role once, so now we'll see if it's undefined, or one of the default failed colors
                *   If it is, we'll start a new collection, create a new role, and then restart the loop
                */

                do {
                    var colorBad = false;

                    if (!createRole || createRole.hexColor == "#00000a" || createRole.hexColor == "#00000b" || createRole.hexColor == "#0000ad" || createRole.hexColor == "#000000") {
                        await channel.send({ embeds: [thirdBadColor] }).catch((error) => console.error("Failed to send message", error));

                        colorBad = true;

                        const thirdRoleCheckCollection = await channel
                            .awaitMessages({
                                filter,
                                max: 1,
                                time: 300000,
                                errors: ["time"],
                            })
                            .catch((collected) => {
                                channel.delete("role creator timeout");
                                return;
                            });

                        await createRole.setColor(thirdRoleCheckCollection.first().content.toUpperCase()).catch((e) => console.error(`Failed to create role ${desiredRoleName} for ${interaction.user.username}:`, e.message));
                    };
                } while (colorBad);

                /* 
                *   Once the role creation worked create the role
                *   Then send the embed
                *   Add the user to the role
                *   Set a timer for deleting the channel
                */

                const completedEmbed = new MessageEmbed()
                    .setTitle("Role creation successful!")
                    .setDescription("This channel will be deleted shortly.")
                    .setColor(process.env.embedColor);

                await channel.send({ embeds: [completedEmbed] });

                await interaction.member.roles.add(createRole.id).catch((error) => console.log("Failed to add member to role", error));

                console.log(`${interaction.user.tag} created role ${desiredRoleName} (${createRole.id}) with the color ${desiredRoleColor}`);

                setTimeout(async () => {
                    await channel.delete().catch((error) => console.error("Failed to delete channel", error));
                }, 30000);
            }


        } else if (interaction.customId == "reactRoleDelete") {

            /*
            *   Checks if the button is to delete the role
            *   However, we need to make sure it's a unique custom role
            *   if they don't actually have a role then we send an embed saying that
            */

            if (memberRoles > 0) {
                for (let i = 0; i < memberRoles.length; i++) {
                    const findRole = interaction.guild.roles.cache.find(role => role.id == memberRoles[i]);

                    if (findRole.members.size == 1) {
                        await findRole.delete("Time to make a new ROLE POG")
                            .catch(console.error);
                        console.log(`${interaction.user.tag} deleted their role.`)


                    } else {
                        await interaction.user.send("How did you manage to break this?? Talk to someone with permissions so they can fix this...")
                            .catch((error) => console.error("Failed to DM the user", error));
                        return;
                    }
                }


            } else {
                const embed = new MessageEmbed()
                    .setTitle("You have no role to be deleted silly!!")
                    .setDescription("Don't be shy, make a role now...")
                    .setFooter(`Sent from ${interaction.guild.name}.`, interaction.guild.iconURL())
                    .setColor(process.env.embedColor);

                await interaction.user.send({ embeds: [embed] }).catch((error) => console.error("Failed to DM the user.", error));
                return;
            }
        }
    }
}
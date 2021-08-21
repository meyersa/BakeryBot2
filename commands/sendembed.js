const sendEmbed = require("../functions/sendEmbed");
const verifyAdmin = require("../functions/verifyAdmin");

module.exports = {
    name: "sendEmbed",
    summary: "Lets admins send an embed from a command with basic arguments",
    async execute(args, message) {
        
        if (!verifyAdmin.execute(message)) return;
        // Checks for admin first 
        
        await sendEmbed.execute(
            message, // Message info
            args[0], // Title of embed
            args[1], // Body of Embed
            args[2], // Image of embed
            args[3], // Footer of embed
        );
    },
};
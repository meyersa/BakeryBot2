module.exports = {
    name: "help",
    summary: "Possible actual help command in the future.",
    execute(args, message) {
        message.reply("There's not much I can help you with :(")
        .catch((e) => console.error("Failed to send help reply.", e));
        
    },
};
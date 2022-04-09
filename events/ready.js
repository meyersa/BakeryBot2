module.exports = {
    name: 'ready',
    summary: "Ready event. Pretty boring, basically just runs once",
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        
        client.user.setActivity("baking simulator", { type: "PLAYING" });

    },
};
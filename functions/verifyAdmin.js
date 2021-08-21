const config = require("../config/config.json");

module.exports = {
    name: "verifyAdmin",
    summary: "Checks for admin, returns true for admin",
    execute(message) {
        if (message.member.roles.cache.find(r => r.id == config.adminRoleID)) { // Checks for admin role, returns true
            return true;
        } else { // Doesn't find admin role, returns false
            return false;
        };
    },
};
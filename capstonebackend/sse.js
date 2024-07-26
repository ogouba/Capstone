const SSE = {
    userConnections: {},
    sendNotification(username, message) {
        if (Object.prototype.hasOwnProperty.call(this.userConnections, username)){
            for (const client of this.userConnections[username]) {
                client.write("data: " + JSON.stringify(message) + "\n\n");
            }
        }
    },
    addNotification(username, client) {
        if (!this.userConnections[username]) {
            this.userConnections[username] = [];
        }
        this.userConnections[username].push(client);
    },
    removeUserClient(username, client) {
        this.userConnections[username] = this.userConnections[username].filter((com) => com !== client);
    },
};
module.exports = SSE ;






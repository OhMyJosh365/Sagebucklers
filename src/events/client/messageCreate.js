const mongoose = require("mongoose");

module.exports = {
    name: "messageCreate",
    async execute(message, client){
        if(message.author.bot) return;
        
    },
}
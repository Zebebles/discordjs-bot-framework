const fs = require("fs");

module.exports = function(){
    this.onMessage = function(msg){
        let prefix = msg.client.Prefix;
        if(msg.content.substring(0, prefix.length) != prefix && !msg.isMentioned(msg.client.user)) return;
        let command;
        if(msg.isMentioned(msg.client.user)) command = msg.content.split(" ")[1].trim();
        else command = msg.content.split(" ")[0].trim();
        
        msg.client.Commands.forEach(cmd => {
            if(cmd.areYou(command)){
                cmd.run(msg);
            }
        });
    }
}
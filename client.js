const {Client} = require("discord.js"); 
const Discord = require("discord.js");
const fs = require("fs");
const path = require('path');
   
class DBFClient extends Client{
    constructor(options = {}) {
        super(options);

        if(!options.prefix) throw Error("You must specify a prefiix");
        else this.prefix = options.prefix;
        
        if(!options.name) throw Error("You must specify a name for your bot");
        else this.name = options.name;

        if(!options.author) throw Error("You must specify an author"); 
        else this.author = options.author;

        if(!options.token) throw Error("You must specify a token");
        else this.token = options.token;
        
        if(!options.cmddir) throw Error("You must specify a command directory"); 
        else this.commandsdir = options.cmddir;

        this._MentionsTrigger = options.MentionsTrigger;

        this.commands = new Array();

        this.on("message", msg => {
            let prefix = msg.client.Prefix;
            if(msg.content.substring(0, prefix.length) != prefix && !msg.isMentioned(msg.client.user)) return;
            let command;
            if(msg.isMentioned(msg.client.user) && this.MentionsTrigger) command = msg.content.split(" ")[1];
            else command = msg.content.split(" ")[0];
            if(command.match("<&")) return;
            if(command) command = command.replace(prefix, "");
            else return;
            msg.client.Commands.forEach(cmd => {
                if(cmd.areYou(command.toLowerCase())){
                    if(cmd.OwnerOnly && (msg.author.id != msg.client.Author)) return;
                    if(cmd.GuildOnly && msg.channel.type != "text") return;
                    cmd.run(msg);
                }
            });
        });

        this.on("ready", () =>{
            console.log("logged in as " + this.name);
            this.user.setUsername(this.name);
            this.user.setGame(this.prefix + "help");
        });
    }

    get Prefix() { return this.prefix; }
    set Prefix(value) { this.prefix = value; }

    get MentionsTrigger(){return this._MentionsTrigger;}

    get Name() { return this.name; }
    set Name(value) { this.name = value; }

    get Author() { return this.author; }

    get Token() { return this.token; }
    
    get CommandsDir() { return this.commandsdir; }
    set CommandsDir(value) { this.commandsdir = value; }

    get Commands(){ return this.commands }


    login(){
        
        fs.readdir(this.CommandsDir, (err, files) => {
            if(err) return console.log(err);
            files.forEach(file => {
                if (path.extname(file) == ".js"){
                    const Command = require(path.join(this.CommandsDir, file));
                    const cmd = new Command();
                    this.commands.push(cmd);
                }
            });
        });

        super.login(this.token+"");
    }

    getHelp(message){
        let helpEmbed = new Discord.RichEmbed();
        helpEmbed.setColor([127, 161, 216]);
        let groups = [];
        let cmds = this.Commands;
        cmds.forEach(cmd => {
            let group = groups.filter(group => group == cmd.Group);
            if(group.length == 0) groups.push(cmd.Group);
        });
        let helpMsg;
        groups.forEach(group => {
                helpMsg = "\n";
                let groupCommands = cmds.filter(cmd => {
                    if(group == cmd.Group) return cmd;
                });
                groupCommands.forEach(command =>{
                     if(command.OwnerOnly && (message.author.id != message.client.Author));
                     else helpMsg += "\n\n**" + command.Triggers[0] + "** : *" + command.Description + "*"; 
                });
            helpEmbed.addField(group, helpMsg);
        });

        return helpEmbed;
    }
}

module.exports = DBFClient;
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
            let user;
            let args = "";
            if(msg.content.substring(0, prefix.length) != prefix && !msg.isMentioned(msg.client.user)) return;
            let command;
            if((msg.mentions.users.first() && msg.mentions.users.first().id == msg.client.user.id) && (msg.content.substring(0,2) == "<@") && this.MentionsTrigger) command = msg.content.split(" ")[1];
            else if(msg.mentions.users.first() && (msg.mentions.users.first().id == msg.client.user.id) && !this.MentionsTrigger) return;
            else command = msg.content.split(" ")[0];
            if(command) command = command.replace(prefix, "");
            else return;
            msg.client.Commands.forEach(cmd => {
                if(cmd.areYou(command.toLowerCase())){
                    if(cmd.OwnerOnly && (msg.author.id != msg.client.Author)) return;
                    if(cmd.GuildOnly && msg.channel.type != "text") return;
                    if(cmd.ReqUser) user = this.findUser(msg);
                    if(cmd.ReqArgs) args = this.getArgs(msg);
                    cmd.run({"msg": msg, "user": user, "args": args});
                }
            });
        });

        this.on("ready", () =>{
            console.log("logged in as " + this.name);
            this.user.setUsername(this.name);
            this.user.setPresence({game : {name : this.Prefix + "help", type: 0}});
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

    getArgs(msg){
        let i = 0;
        if (msg.mentions.users.first() && (msg.mentions.users.first().id == this.user.id) && (msg.content.substring(0,2) == "<@")) i = 2; //@bot command arg arg
        else  i = 1; //>>command arg arg
        let argsArray = msg.content.split(" ");
        if (!(argsArray.length > i)) return console.log("no args");
        let args = "";
        for(i; i < argsArray.length; i++){ //usernames can be more than one word long.
            args += " " + argsArray[i];
        }
        return args.trim();
    }

    findUser(msg){
        var foundUser;
        var countClientMentions;
        if (msg.mentions.users.first() && (msg.mentions.users.first().id == this.user.id && msg.mentions.users.array().length > 1)){ //@bot command @user
            msg.mentions.users.array().forEach(user =>{
                if(user.id !== this.user.id) foundUser = user;
            });
        }else if (msg.mentions.users.first() && (msg.mentions.users.first().id == this.user.id)){ //@bot command username OR prefix.commmand @bot OR @bot command @bot
            let reg = new RegExp(/.[^ ]*[ ].[^ ]*[ ].[^ ]*/);
            if (msg.content.substring(0,2) != "<@") return this.user; //if the message doesnt start with an @mention, it must be a prefix.command @bot, in which case the bot is the user
            if(!reg.test(msg.content)) return console.log("didn't meet regex");
            let botmentions = 0;
            msg.content.split(" ").forEach(word => { //this counts how many times the bot was mentioned.
                if(word.replace(/[<>@]/g, "") == this.user.id) botmentions++; 
            });
            if(botmentions > 1) foundUser = this.user; //if the bot was mentioned twice, the user it returns will be the bot
            else{ //if the bot was only mentioned once (this means )
                let ind = 2;
                let uname = msg.content;
                let unameArray = uname.split(" ");
                uname = "";
                for(let i = ind; i < unameArray.length; i++){ //usernames can be more than one word long.
                    uname+= " " + unameArray[i];
                }
                uname = uname.trim();
                foundUser = msg.guild.members.find(mem => mem.user.username.toLowerCase() == uname.toLowerCase());
                if (foundUser) foundUser = foundUser.user;
            }
        }else if (msg.mentions.users.first()){
            foundUser = msg.mentions.users.first();
        }else{
            var uname = msg.content;
            let reg = new RegExp(/.[^ ]*[ ].[^ ]*/);
            if(!reg.test(uname)) return;
            let ind = 1;
            let unameArray = uname.split(" ");
            uname = "";
            for(let i = ind; i < unameArray.length; i++){
                uname+= " " + unameArray[i];
            }
            uname = uname.trim();
            foundUser = msg.guild.members.find(mem => mem.user.username.toLowerCase() === uname.toLowerCase());
        }
        return foundUser;
    }
}

module.exports = DBFClient;
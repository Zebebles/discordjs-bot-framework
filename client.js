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
            if(msg.guild && msg.guild.prefix) prefix = msg.guild.prefix;
            let user;
            let args = "";
            let command;
            if(msg.content.substring(0,2) == "<@" && (msg.content.indexOf(msg.client.user.id) == 3 || msg.content.indexOf(msg.client.user.id) == 2)){//@bot command (maybe @bot)
                let regex = new RegExp(/[ ]/g);
                command = msg.content;
                if(!regex.test(command)) return;
                command = msg.content.split(" ")[1];
            }else if(msg.content.substring(0,prefix.length) == prefix){
                command = msg.content.trim() + " ";
                command = command.split(" ")[0].replace(prefix, "").trim();
            }else return;
            msg.client.Commands.forEach(cmd => {
                if(cmd.areYou(command.toLowerCase())){
                    if(cmd.OwnerOnly && (msg.author.id != msg.client.Author)) return;
                    if(cmd.GuildOnly && msg.channel.type != "text") return;
                    if( msg.guild && ((msg.channel.disabledCommands && msg.channel.disabledCommands.find(command => cmd._name == command)) 
                        || (msg.guild.disabledCommands && msg.guild.disabledCommands.find(command => command == cmd._name))))
                            return
                    if(cmd.ReqUser) user = this.findUser(msg);
                    if(cmd.ReqArgs) args = this.getArgs(msg);
                    cmd.run({"msg": msg, "user": user, "args": args});
                }
            });
        });

        this.on("ready", () =>{
            console.log("logged in as " + this.name);
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
        let helpEmbeds = new Array();
        let groups = [];
        let cmds = this.Commands;
        cmds.forEach(cmd => {
            let group = groups.filter(group => group == cmd.Group);
            if(group.length == 0) groups.push(cmd.Group);
        });
        let helpMsg;
        groups.forEach(group => {
                helpEmbeds.push(new Discord.RichEmbed());
                helpEmbeds[helpEmbeds.length - 1].setColor([127, 161, 216]);                            
                helpMsg = "\n";
                let groupCommands = cmds.filter(cmd => {
                    if(group == cmd.Group) return cmd;
                });
                groupCommands.forEach(command =>{
                     if(command.OwnerOnly && (message.author.id != message.client.Author));
                     else helpMsg += "\n\n**" + command.Triggers[0] + "** : *" + command.Description + "*"; 
                });
            helpEmbeds[helpEmbeds.length-1].setTitle(group);
            helpEmbeds[helpEmbeds.length-1].setDescription(helpMsg);
        });

        return helpEmbeds;
    }

    getArgs(msg){
        let i = 0;
        if (msg.content.substring(0,2) == "<@") i = 2; //@bot command arg arg
        else  i = 1; //>>command arg arg
        let argsArray = msg.content.split(" ");
        if (!(argsArray.length > i)) return;
        let args = "";
        for(i; i < argsArray.length; i++){ //usernames can be more than one word long.
            args += " " + argsArray[i];
        }
        return args.trim();
    }

    findUser(msg){
        //console.log("finding user");
        let args = this.getArgs(msg);
        if(!args || args == "") return;
        let found =  msg.mentions.members.find(mem => mem.user.id != this.user.id) || 
            msg.guild.members.find(mem => mem.user.username.toLowerCase().trim().includes(args.toLowerCase().trim()) || 
            mem.displayName.toLowerCase().trim().includes(args.toLowerCase().trim())) || 
            msg.guild.members.get(this.user.id);
        if(found.user == this.user && !(args.toLowerCase().includes(this.Name.toLowerCase()) || args.includes(this.user.id))) return;
        return found.user; 
    }
}

module.exports = DBFClient;
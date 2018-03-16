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
            if(msg.guild && !msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES"))
                return;
            if(msg.content.substring(0,2) == "<@" && (msg.content.indexOf(msg.client.user.id) == 3 || msg.content.indexOf(msg.client.user.id) == 2)){//@bot command (maybe @bot)
                let regex = new RegExp(/[ ]/g);
                command = msg.content;
                if(!regex.test(command)) return;
                command = msg.content.split(" ")[1];
            }else if(msg.content.substring(0,prefix.length) == prefix || msg.channel.type == "dm"){
                command = msg.content.trim() + " ";
                command = command.split(" ")[0].replace(prefix, "").trim();
            }else return;
            msg.client.Commands.forEach(cmd => {
                if(cmd.areYou(command.toLowerCase())){
                    //spam check
                    if(msg.author.nextUse && msg.author.nextUse > Date.now())
                        return msg.reply("Hold up! You're on command cooldown for another **" + ((msg.author.nextUse - Date.now())/1000).toFixed(1) + "** seconds.").then(m => m.delete(2500));
                    else
                        msg.author.nextUse = Date.now() + 1000;
                    //end spam check
                    if(cmd.OwnerOnly && (msg.author.id != msg.client.Author)) return;
                    if(cmd.GuildOnly && msg.channel.type != "text") return msg.channel.send("The command **" + cmd.triggers[0] + "** can't be used in private chats.");
                    if( msg.guild && ((msg.channel.disabledCommands && msg.channel.disabledCommands.find(command => cmd.name == command)) 
                        || (msg.guild.disabledCommands && msg.guild.disabledCommands.find(command => command == cmd.name))))
                            return
                    if(cmd.ReqUser) user = this.findUser(msg);
                    if(cmd.ReqArgs) args = this.getArgs(msg);
                    try{
                        cmd.run({"msg": msg, "user": user, "args": args});
                    }catch(e){
                        if(msg.guild)
                            console.log("Error executing command '" + cmd.name + "' in '" + msg.guild.name + "'\n" + e)
                        else
                            console.log("Error executing command '" + cmd.name + "' in dm'\n" + e)
                    }
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
        let removing = 1;
        if(msg.content.indexOf(this.user.id + ">") == 2) // @bot command args.  else prefixcommand args
            removing = 2;
        let args = msg.content.split(" ");
        return (args && args.splice(0,removing)) ? args.join(" ") : null;
    }

    findUser(msg){
        let args = this.getArgs(msg) + " ";
        let regex = new RegExp("@(!)?" + this.user.id + ">", "g");
        let found =  msg.mentions.members.find(mem => mem.user.id != this.user.id) 
                        || (args.match(regex) ? msg.guild.me : (args ? msg.guild.members.find(mem =>  mem.displayName.toLowerCase().trim().includes(args.toLowerCase().trim())
                                                                                            ||  mem.user.username.toLowerCase().trim().includes(args.toLowerCase().trim())
                                                                                            || (args.split(" ") && args.split(" ").find(arg => !arg.match(/^\d+$/g) && (mem.displayName.toLowerCase().trim().includes(arg.toLowerCase().trim()) //  check if any of the words in args match usernames.
                                                                                                                                            || mem.user.username.toLowerCase().trim().includes(arg.toLowerCase().trim())))) //  Doesn't check words that are just numbrs
                                                                                                ? mem : null ): null));
        return found ? found.user : null; 
    }
}

module.exports = DBFClient;
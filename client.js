const {Client} = require("discord.js"); 
const Discord = require("discord.js");
const fs = require("fs");
const path = require('path');
   
class DBFClient extends Client{
    constructor(options) {
        super(options);

        if(!options.prefix) throw Error("You must specify a prefiix");
        else this.prefix = options.prefix;

        if(!options.author) throw Error("You must specify an author"); 
        else this.author = options.author;

        if(!options.token) throw Error("You must specify a token");
        else this.token = options.token;
        
        if(!options.cmddir) throw Error("You must specify a command directory"); 
        else this.commandsdir = options.cmddir;

        this.mentionsTrigger = options.MentionsTrigger;

        this.commands = new Array();

        this.on("message", msg => {
            let prefix = (msg.guild && msg.guild.prefix) ? msg.guild.prefix : this.prefix;
            let user, args, command;
            if(msg.guild && !msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) //If the bot doesn't have perms to talk in the channel.
                return;

            var prefixRegex = (this.mentionsTrigger) ? new RegExp(prefix.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g,"\\$&") + '|<@(!)?' + this.user.id + '>', 'g') : new RegExp(prefix.replace(/[!@#$%^&*()+=\-[\]\\';,./{}|":<>?~_]/g,"\\$&"), 'g');
            
            command = (msg.content.match(prefixRegex) && msg.content.trim().indexOf(msg.content.match(prefixRegex)[0]) == 0) 
            /*if msg starts with prefix*/   ? ((msg.content.replace(prefixRegex,"").trim().split(" "))
                    /*if the command has arguments*/    ? msg.content.replace(prefixRegex,"").trim().split(" ")[0]
                    /*if its one word*/                 : msg.content.replace(prefixRegex,"").trim())
            /*if it doesnt start w/ prfx*/  : null;
            if(!command) //if couldn't find a word after the prefix.
                return;
            
            if(msg.author.nextUse && msg.author.nextUse > Date.now()) //check if the user's spamming commands.
                return msg.reply("Hold up! You're on command cooldown for another **" + ((msg.author.nextUse - Date.now())/1000).toFixed(1) + "** seconds.").then(m => m.delete(2500));
            else
                msg.author.nextUse = Date.now() + 1000; //user can't use another cmd for 1s
            
            let cmd = this.commands.find(c => c.areYou(command));//try find a command that matches the command name
            if(!cmd) //if the command doesn't exist.
                return;
            
            if((cmd.reqUserPerms.length != 0 || cmd.reqBotPerms != 0) && msg.guild){
                let userMissing = msg.member.missingPermissions(cmd.reqUserPerms);
                if(userMissing && userMissing.length != 0)
                    return msg.channel.send("You need permission `" + userMissing[0] + "` to do that.");
                let botMissing = msg.guild.me.missingPermissions(cmd.reqBotPerms);
                if(botMissing && botMissing.length != 0)
                    return msg.channel.send("I need permission `" + botMissing[0] + "` to be able to do that.");
            }

            if(cmd.OwnerOnly && (msg.author.id != msg.client.Author)) return; //if the cmd is owner only and the user isnt the owner
            
            if(cmd.GuildOnly && msg.channel.type != "text")  //if the commands guild only and the channel isn't a text ch
                return msg.channel.send("The command `" + cmd.name + "` can't be used in private chats.");
                
            if( msg.guild && ((msg.channel.disabledCommands && msg.channel.disabledCommands.find(command => cmd.name == command)) 
                || (msg.guild.disabledCommands && msg.guild.disabledCommands.find(command => command == cmd.name))))
                    return
                
            if(cmd.reqUser) //set the user variable if the command needs the user.
                user = this.findUser(msg);
                
            if(cmd.reqArgs) //set the args variable if the command needs the args.
                args = this.getArgs(msg);
            try{
                cmd.run({"msg": msg, "user": user, "args": args}); //run the command 
            }catch(err){
                console.log("Error executing command " + cmd.name + ".\nMessage that triggered: " + msg.content + "\n"+err);
            }
        });

        this.on("ready", () =>{
            console.log("logged in as " + this.user.username);
        });
    }

    login(){
        fs.readdir(this.commandsdir, (err, files) => {
            if(err) return console.log(err);
            files.forEach(file => {
                if (path.extname(file) == ".js"){
                    const Command = require(path.join(this.commandsdir, file));
                    const cmd = new Command();
                    cmd.filename = path.join(this.commandsdir, file);
                    this.commands.push(cmd);
                }
            });
        });

        super.login(this.token+"");
    }

    reloadCommands(identifier){
        let toReload = identifier 
            ?   this.commands.filter(cmd => cmd.group.toLowerCase().trim() == identifier.trim().toLowerCase() || cmd.areYou(identifier.trim().toLowerCase())) 
            :   this.commands;
        if(!toReload[0])
            return;
        
        toReload.forEach(cmd => {
            delete require.cache[require.resolve(cmd.filename)];
            const Command = require(cmd.filename);
            const CMD = new Command();
            CMD.filename = cmd.filename;
            this.commands[this.commands.indexOf(cmd)] = CMD;
        });
        return toReload.length;
        
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
                        || (args.match(regex) ? msg.guild.me : (args != " " ? msg.guild.members.find(mem =>  mem.displayName.toLowerCase().trim().includes(args.toLowerCase().trim())
                                                                                            ||  mem.user.username.toLowerCase().trim().includes(args.toLowerCase().trim())
                                                                                            || (args.split(" ") && args.split(" ").find(arg => !arg.match(/^\d+$/g) && (mem.displayName.toLowerCase().trim().includes(arg.toLowerCase().trim()) //  check if any of the words in args match usernames.
                                                                                                                                            || mem.user.username.toLowerCase().trim().includes(arg.toLowerCase().trim())))) //  Doesn't check words that are just numbrs
                                                                                                ? mem : null ): null));
        return found ? found.user : null; 
    }
}

module.exports = DBFClient;
const {Client} = require("discord.js"); 
const fs = require("fs");
const path = require('path');
require("./msgHandler.js")();
   
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

        this.commands = new Array();

        this.on("message", msg => onMessage(msg, this.commands));

        this.on("ready", () =>{
            console.log("logged in as " + this.name);
            this.user.setUsername(this.name);
        });
    }

    get Prefix() { return this.prefix; }
    set Prefix(value) { this.prefix = value; }

    get Name() { return this.name; }
    set Name(value) { this.name = value; }

    get Author() { return this.author; }

    get Token() { return this.token; }
    set Token(value) { this.token = value; }

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

    getHelp(){
        let groups = [];
        let cmds = this.Commands;
        cmds.forEach(cmd => {
            let group = groups.filter(group => group == cmd.Group);
            if(group.length == 0) groups.push(cmd.Group);
        });
        let helpMsg = "";
        groups.forEach(group => {
                helpMsg += "\n\n**" + group + "**"; 
                let groupCommands = cmds.filter(cmd =>group == cmd.group);
                groupCommands.forEach(command =>{
                helpMsg += "\n\t**" + command.Trigger + "** : *" + command.Description + "*"; 
            });
        });

        return helpMsg;
    }
}

module.exports = DBFClient;
class Command{
    constructor(obj)
    {
        if (!obj.name)
            throw Error("Must define a command name.");
        if(!obj.description)
            throw Error("Must define command description");
        if (!obj.example)
            throw Error("Must define a commmand example");
        if (!obj.group)
            throw Error("Must define a command group");
        this.name = obj.name;
        this.ownerOnly = obj.ownerOnly;
        this.group = obj.group;
        this.triggers = obj.triggers;
        this.description = obj.description;
        this.example = obj.example;
        this.reqUser = obj.reqUser;
        this.group = obj.group;
        this.reqArgs = obj.reqArgs;
        this.guildOnly = obj.guildOnly;
        this.reqUserPerms = obj.reqUserPerms ? obj.reqUserPerms : new Array(); 
        this.reqBotPerms = obj.reqBotPerms ? obj.reqBotPerms : new Array(); 
    }

    run() {
        console.log("default command");
    }

    areYou(cmd){
        if(cmd.trim() == this.name.toLowerCase())
            return true;
        var found = false;
        this.triggers.forEach(trigger => {
            if (cmd.trim() == trigger.trim())
                found = true;
        });

        return found
    }
}

module.exports = Command;

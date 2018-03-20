class Command{
    constructor(obj)
    {
        if (!obj.name)
            throw Error("Must define a command name.");
        if(!obj.description)
            throw Error("Must define command description.");
        this.name = obj.name;
        this.ownerOnly = obj.ownerOnly;
        this.group = obj.group ? obj.group : "all";
        this.triggers = obj.triggers ? obj.triggers : new Array();
        this.description = obj.description;
        this.example = obj.example ? obj.example : "";
        this.reqUser = obj.reqUser;
        this.reqArgs = obj.reqArgs;
        this.guildOnly = obj.guildOnly;
        this.reqUserPerms = obj.reqUserPerms ? obj.reqUserPerms : new Array(); 
        this.reqBotPerms = obj.reqBotPerms ? obj.reqBotPerms : new Array(); 
    }

    run() {
        console.log("default command");
    }

    areYou(cmd){
        if(cmd.trim().toLowerCase() == this.name.toLowerCase())
            return true;
        var found = false;
        this.triggers.forEach(trigger => {
            if (cmd.trim().toLowerCase() == trigger.trim().toLowerCase())
                found = true;
        });

        return found
    }
}

module.exports = Command;

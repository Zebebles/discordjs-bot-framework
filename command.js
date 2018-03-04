class Command{
    constructor(obj = {
        name: name,
        triggers: triggers,
        description: description,
        example: example,
        group: group,
        guildOnly: guildOnly,
        ownerOnly: ownerOnly,
        reqUser: reqUser,
        reqArgs: reqArgs
    }) {
        this.name = obj.name;
        this.ownerOnly = obj.ownerOnly;
        if (obj.group)  this._group = obj.group;
        if (!obj.triggers) throw Error("Must define a trigger");
        else  this.triggers = obj.triggers;
        this.description = obj.description;
        if(obj.example)
            this.example = obj.example;
        this.reqUser = obj.reqUser;
        this.group = obj.group;
        this.reqArgs = obj.reqArgs;
        if (obj.guildOnly)  this.guildOnly = obj.guildOnly;
    }

    get Name() { return this.name;  }
    set Name(value) { this.name = value; }

    get Triggers() { return this.triggers; }
    set Triggers(value) { this.triggers = value; }

    get OwnerOnly(){return this.ownerOnly;}
    set OwnerOnly(value){this.ownerOnly = value;}

    get ReqUser(){ return this.reqUser;}
    
    get ReqArgs(){return this.reqArgs;}

    get GuildOnly() { return this.guildOnly; }
    set GuildOnly(value) {this.guildOnly = value; }

    get Group() { return this.group; }
    set Group(value) { return this.group; }

    get Description() { return this.description; }
    set Description(value) { this.description = value; }

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

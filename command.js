class Command{
    constructor(obj = {
        name: name,
        triggers: triggers,
        description: description,
        group: group,
        guildOnly: guildOnly,
        ownerOnly: ownerOnly
    }) {
        this._name = obj.name;
        this.ownerOnly = obj.ownerOnly;
        if (obj.group)  this._group = obj.group;
        if (!obj.triggers) throw Error("Must define a trigger");
        else  this._triggers = obj.triggers;
         this._description = obj.description;
        if (obj.guildOnly)  this._guildOnly = obj.guildOnly;
    }

    get Name() { return this._name;  }
    set Name(value) { this._name = value; }

    get Triggers() { return this._triggers; }
    set Triggers(value) { this._triggers = value; }

    get OwnerOnly(){return this.ownerOnly;}
    set OwnerOnly(value){this.ownerOnly = value;}

    get GuildOnly() { return this._guildOnly; }
    set GuildOnly(value) {this._guildOnly = value; }

    get Group() { return this._group; }
    set Group(value) { return this._group; }

    get Description() { return this._description; }
    set Description(value) { this._description = value; }

    run() {
        console.log("default command");
    }

    areYou(cmd){
        var found = false;
        this._triggers.forEach(trigger => {
            if (cmd == trigger) found = true;
        });
        return found
    }
}

module.exports = Command;

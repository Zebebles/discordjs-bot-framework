# discordjs-bot-framework

## About
An easy to use framwork for Discord bots, using the discord.js library.

## Installation:
`npm install discordjs-bot-framework`

[GitHub](https://github.com/zebebles/discordjs-bot-framework)

## Use:

### Your main bot file
```javascript
const DBF = require("discordjs-bot-framework");

let TestBot = new DBF.Client({
	author: "your_discord_id_here", //this is used to check if the 	message was sent by the bot creator for ownerOnly commands
	prefix: "$$", //this is used as the prefix for any command your bot will respond to.  The bot will also respont to @mentions followed by command triggers.
	cmddir: require('path').join(__dirname, 'commands'), //this is the directory of your command folder.
	token: "your_token_here", //this is your bots token.  It is used to log in as the client, and hence, should not be shared (read from json if you're bot is on github!)
	MentionsTrigger: true //if this is true, @mentions followed by commands will trigger said command.
});

TestBot.login();

```

### An example command file
```javascript
const DBF = require('discordjs-bot-framework');

module.exports = class Hello extends DBF.Command{
    constructor(){
        super({
             name: "hello", //is pretty much just another trigger, but can be used filter commands.
             triggers: ["hi", "hello"], //any message (excluding prefix) that will trigger this command.
             group: "Misc", //this command will come under this group in the automatic help message.
             ownerOnly : true, //if this command is to be used by the bot creator only.
             description: "sends hello in the channel", //this will show in the help message
             example: ">>hello", //do what you want with this, can be used in your help message.
             guildOnly : true, //any command that refers to a guild with the discord.js library will crash if it triggered in a dm channel.  This prevents that
	         reqArgs: true, //if your command requires any args after the command, this will add them as msg parameters
	         reqUser: true, //if your command requires an @mentioned user, this will find them add them as msg parameters
             reqBotPerms: ["MANAGE_MESSAGES"], //any permissions that the bot needs to run this command.
             reqUserPerms: ["MANAGE_MESSAGES"] //any permissions that the user should need for the bot to run this command.
        });
    }

    run(params = {"msg": msg, "user": user, "args": args}){ //all the code for your command goes in here.  user and args will be null unless the reqUser and reqArgs fields above are set to true.
        message.channel.send("Hello" + params.args);
    }
}

```


##Client class
***IMPORTANT: all of the properties, properties, and events attatched to client can be called from anything that links to client in the discord.js library.  i.e. msg.client.getArgs(msg) or msg.client.on('commandRun')***

###Methods

`Client.getArgs(message)` : gets any arguments after the command in a message.[string] *note: if your bot is using MentionsTrigger, you'll definately want to use this*

`Client.findUser(message)` : finds a user based on an @mention or a username.[Discord.user] *note: if your bot is using MentionsTrigger, you'll definately want to use this*

`Client.reloadCommands(command_name or group)` : reloads a command or a group of commands.  Any changes to the command will be applied [int - number of commands reloaded]? or null

###Properties

`Client.prefix`: The bots prefix. [string]

`Client.author` : The authors discord ID, string. [snowflake]

`Client.commandsDir` : The commands directory, string. [string]

`Client.commands` : gets an array of commands from the client, array of Commands. [Array(command)]

`Client.mentionsTrigger` : if @mentioning the client, followed by a command will trigger the command. [bool]

###Events

`commandRun` : This event is emitted whenever a command is successfully run.
```javascript
Client.on('commandRun', function(command, message) {
    console.log("Command successfully run: " + command.name);
});
```

`commandError` : This event is emitted whenever a command has an error.
```Javascript
Client.on('commandError', function(data) {
    console.log("Error running command " + data.command.name + " in " + data.message.guild.name + "\n" + data.error);
});
```

`notGuild` : This event is emitted whenever anyone tries to run a guildOnly command in a dm channel.
```Javascript
Client.on('notGuild', function(command, message) {
    console.log("guildOnly command " + command.name + " tried in dm channel with " + message.author.username);
});
```

`missingPermissions` : This event is emitted whenever a command is run and either the bot or the user is missing any of the permissions specified by you.
```Javascript
Client.on('missingPermissions', function(data){
    if(data.bot)
    {
        data.message.channel.send("I need permission `" + data.permissions[0] + "` to be able to do that.");
    }
    else
    {
        data.message.channel.send("You need permission `" + data.permissions[0] + "` if you want to do that.")
    }
});
```

`ownerCommandTried` : This event is emitted whenever anyone who isn't the author tries to use an ownerOnly command.
```Javascript
Client.on('ownerCommandTried', function(command, message){
    message.channel.send("`" + command.name + "` is only avaliable for the bot owner.");
});
```

##Commands class

###Methods

`Command.run(message)` : runs the command (this is done automatically by the framework when one of the triggers is sent in a message. [void]

`Command.areYou(string)` : check if the command's name or triggers match the string, returns a boolean. [bool]

###Properties

`Command.name`: name of the command. [string]

`Command.triggers` : an array of the commands triggers. [Array(string)]

`Command.ownerOnly` : if the command is OwnerOnly. [bool].

`Command.guildOnly` : If the command is GuildOnly. [bool]

`Command.group` : The group of the command, string. [string]

`Command.description` : The commands description. [string]

`Command.example` : The commands example. [string]

`Command.reqArgs` : Whether or not the command will include arguments (any string following the command name after the message that triggered it) in the run parameters. [bool]

`Command.reqUser` : Whether or not the command will look for a user to include in the run parameters. [bool]

`Command.reqUserPerms` : The permissions a user should have to execute a command. [Array(string)]

`Command.reqBotPerms` : The permissions required for the bot to run the command.  [Array(string)]

 
##Credits:

[Discord.js](https://discord.js.org/#/) Discord.js is the node.js library used by this framework that allows interaction with the Discord API


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
	token: "your_token_here", //this is your bots token.  It is used to log in as the client, and hence, should not be shared.
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

### Methods and Properties

 ***(note: all of the methods/properties attatched to client can be called from anything that links to client in the discord.js library.  i.e. msg.client.getArgs(msg))***

`Client.getArgs(message)` : gets any arguments after the command in a message *note: if your bot is using MentionsTrigger, you'll definately want to use this*

`Client.findUser(message)` : finds a user based on an @mention or a username *note: if your bot is using MentionsTrigger, you'll definately want to use this*

`Client.prefix`: The bots prefix.

`Client.author[read only]` : The authors discord ID, string.

`Client.commandsDir` : The commands directory, string.

`Client.getHelp(message)` : gets a help message based on your command triggers and descriptions.

`Client.commands` : gets an array of commands from the client, array of Commands.

`Client.mentionsTrigger` : if @mentioning the client, followed by a command will trigger the command.  Boolean

`Command.run(message)` : runs the command (this is done automatically by the framework when one of the triggers is sent in a message.

`Command.areYou(string)` : check if the command's name or triggers match the string, returns a boolean.

`Command.name`: name of the command.

`Command.triggers` : an array of the commands triggers.

`Command.ownerOnly` : if the command is OwnerOnly, returns boolean.

`Command.guildOnly` : If the command is GuildOnly, returns boolean.

`Command.group` : The group of the command, string.

`Command.description` : The commands description.

 
## Credits:

[Discord.js](https://discord.js.org/#/) Discord.js is the node.js library used by this framework that allows interaction with the Discord API


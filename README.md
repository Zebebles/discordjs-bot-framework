# discordjs-bot-framework
A framework for discord bots, coded in javascript

## Author
Zeb Muller

## Installation:
Simply clone this repository into your node_modules folder.

## Use:

### Your main bot file
```javascript
const DFW = require("discordjs-bot-framework");

let TestBot = new DFW.Client({
author: "your_discord_id_here",
name: "bot_name_here",
prefix: "$$",
cmddir: require('path').join(__dirname, 'commands'),
token: "your_token_here"
});

\t\t\tTestBot.login();

\t\t
```

### An example command file
```javascript
const DBF = require('discordjs-bot-framework');

module.exports = class Hello extends DBF.Command{
    constructor(){
        super({
             name: "hello",
             triggers: ["hi", "hello"],
             group: "Misc",
             ownerOnly : true,
             description: "sends hello in the channel",
             guildOnly : true
        });
    }

    run(message){
        message.channel.send("Hello");
    }
}

```

### Methods and Properties

 ***(note: all of the methods/properties attatched to client can be called from anything that links to client in the discord.js library)***

`Client.Prefix`: The bots prefix.
\n `Client.Name` : The bots name.
`Client.Author[read only]` : The authors discord ID, string.
`Client.Token[read only]` : The clients token used to log in, string.
`Client.CommandsDir` : The commands directory, string.
`Client.getHelp(message)` : gets a help message based on your command triggers and descriptions
`Client.Commands` : gets an array of commands from the client, array of Commands.
`Command.run(message)` : runs the command (this is done automatically by the framework when one of the triggers is sent in a message.
`Command.areYou(string)` : check if the command's name or triggers match the string, returns a boolean.
`Command.Name`: name of the command.
`Command.Triggers` : an array of the commands triggers.
`Command.OwnerOnly` : if the command is OwnerOnly, returns boolean.
`Command.GuildOnly` : If the command is GuildOnly, returns boolean.
`Command.Group` : The group of the command, string.
`Command.Description` : The commands description.
 
## Credits:

[Discord.js](https://discord.js.org/#/) Discord.js is the node.js library used by this framework that allows interaction with the Discord API

[Smooth discord.js](https://github.com/KyeNormanGill/smooth-discord.js) - This similar bot framework was used as a reference for some things I was unsure of how to do (like all the module.exports stuff and some "path" and "fs" stuff)

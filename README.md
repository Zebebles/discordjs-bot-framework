#discordjs-bot-framework

##About
A lightweight, easy to use framework for Discord bots that makes creating a [Discord.js](https://www.npmjs.com/package/discord.js) bot as easy as 1 2 3 (cliché, I know).

##Installation:
`npm install discordjs-bot-framework`

[GitHub](https://github.com/zebebles/discordjs-bot-framework)

##Setup guide:
###Step 1: Setting up your bot folder
1. Create a folder somewhere named `mybot` or something similar.
2. Create a sub-folder to store all of your commands files in.
3. Open a command prompt window in your bot folder (CNTR+SHIT+RIGHT_CLICK -> Open Command Prompt window here.)
4. Type `npm install discordjs-bot-framework` (make sure you have npm and node installed).

###Step 2: Setting up your main bot file
1. Create a file called index.js or something similar in your bot folder.
2. Open the file with your prefered text editor, and copy-paste the following code.
```javascript
const DBF = require("discordjs-bot-framework");

let TestBot = new DBF.Client({
	author: "your_discord_id_here",                               //  This is used to check if the message was sent by the bot creator for ownerOnly commands
	prefix: "$$",                                                 //  This is used as the prefix for all of your commands.
	cmddir: require('path').join(__dirname, 'commands'),          //  The directory of your command folder. Repalace 'commands' with your commands folder name.
	token: "your_token_here",                                     //  Your bots token.  Anyone who has this can log-in as your bot, so treat it like a password!
	MentionsTrigger: true                                         //  If this is true, @mentions followed by a command name/trigger will trigger the command.  i.e. @YourBot hello
});

TestBot.login();
```
3. Replace all the fields with the relevent information. You can get your bots token [here](https://discordapp.com/developers/applications/me).

###Step 3: Creating your first command.
1. Navigate to the sub-folder you created for all your commands earlier.
2. Create a new file named `helloworld.js`
3. Open the file with your prefered text editor, and copy-paste the following code.
```javascript
const DBF = require('discordjs-bot-framework');

module.exports = class HelloWorld extends DBF.Command{
    constructor(){
        super({
            name: "hello",                                      //  REQUIRED - this is pretty much just another trigger, but can be used filter commands.
            triggers: ["hi", "hey"],                            //  Any string (excluding prefix) that will trigger this command (one word only).
            group: "Misc",                                      //  The command will come under this group.  You can use this to develop a help message and filter commands.
            description: "Sends hello in the channel",          //  REQUIRED -  You can use this to develop a help message.
            example: "$$hello",                                 //  You can use this to develop a better help message.
            ownerOnly : false,                                  //  If the command can only be used by the bot owner. i.e. $$restart or something.
            guildOnly : false,                                  //  Stops any commands that can only be run in guilds from being run in private chats.
	        reqArgs: false,                                     //  If your command requires any args after the command trigger this will pass them into run()
	        reqUser: false,                                     //  If your command requires a user (i.e. $$info @user or something) this will search for one in the message content and pass it into run()
            reqBotPerms: ["SEND_MESSAGES"],                     //  Any permissions that the bot needs to run this command. note that SEND_MESSAGES is checked for automatically and is only being used as an example.
            reqUserPerms: ["SEND_MESSAGES"]                     //  Any permissions that the user should need for the bot to run this command.
        });
    }

    run(params = {"msg": msg, "user": user, "args": args}){     //  All the code for your commands
        let msg = params.msg                                    //  A Discord.js message object.
            , user = params.user                                //  A Discord.js user object, if reqUser is true and one can be found. 
            , args = params.args;                               //  A string containing all characters after the prefix and word that triggered the command. i.e. if the command was triggered by '$$hello test' this would be `test`
        msg.channel.send("Hello world!");                       //  Using the Discord.js message object to communincate with the Discord API.
    }
}
```
4. Open a command prompt window in your bot folder and type `node index.js`
5. Invite your bot to a server and trigger your command by typing `$$hello` in any channel it can see.  Any new message sent in a channel that the bot can see is automatically checked against all the command names/triggers and any command found is executed.
6. Repeat to create more commands but replace the `super({})` fields with all relevent command-specific information.

##Documentation

Read the [Discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome) for all the documentation needed to interact with the Discord API.

###Client class

***IMPORTANT: all of the properties, properties, and events attatched to client can be called from anything that links to client in the discord.js library.  i.e. msg.client.getArgs(msg) or msg.client.on('commandRun')***

####Methods

`Client.getArgs(message)` : gets any arguments after the command in a message.`[string]` *note: if your bot is using MentionsTrigger, you'll definately want to use this*

`Client.findUser(message)` : finds a user based on an @mention or a username.`[Discord.user]` *note: if your bot is using MentionsTrigger, you'll definately want to use this*

`Client.reloadCommands(command_name or group)` : reloads a command or a group of commands.  Any changes to the command will be applied `[int - number of commands reloaded]? or null`

####Properties

`Client.prefix`: The bots prefix. `[string]`

`Client.author` : The authors discord ID, string. `[snowflake]`

`Client.commandsDir` : The commands directory, string. `[string]`

`Client.commands` : gets an array of commands from the client, array of Commands. `[Array(command)]`

`Client.mentionsTrigger` : if @mentioning the client, followed by a command will trigger the command. `[bool]`

####Events

`commandRun` : This event is emitted whenever a command is successfully run.
```javascript
Client.on('commandRun', function(command, message) {
    console.log("Command successfully run: " + command.name);
});
```

`commandError` : This event is emitted whenever a command has an error.
```javascript
Client.on('commandError', function(data) {
    console.log("Error running command " + data.command.name + " in " + data.message.guild.name + "\n" + data.error);
});
```

`notGuild` : This event is emitted whenever anyone tries to run a guildOnly command in a dm channel.
```javascript
Client.on('notGuild', function(command, message) {
    console.log("guildOnly command " + command.name + " tried in dm channel with " + message.author.username);
});
```

`missingPermissions` : This event is emitted whenever a command is run and either the bot or the user is missing any of the permissions specified by you.
```javascript
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
```javascript
Client.on('ownerCommandTried', function(command, message){
    message.channel.send("`" + command.name + "` is only avaliable for the bot owner.");
});
```

###Commands class

####Methods

`Command.run(message)` : runs the command (this is done automatically by the framework when one of the triggers is sent in a message. `[void]`

`Command.areYou(string)` : check if the command's name or triggers match the string, returns a boolean. `[bool]`

####Properties

`Command.name`: name of the command. `[string]`

`Command.triggers` : an array of the commands triggers. `[Array(string)]`

`Command.ownerOnly` : if the command is OwnerOnly. `[bool]`

`Command.guildOnly` : If the command is GuildOnly. `[bool]`

`Command.group` : The group of the command, string. `[string]`

`Command.description` : The commands description. `[string]`

`Command.example` : The commands example. `[string]`

`Command.reqArgs` : Whether or not the command will include arguments (any string following the command name after the message that triggered it) in the run parameters. `[bool]`

`Command.reqUser` : Whether or not the command will look for a user to include in the run parameters. `[bool]`

`Command.reqUserPerms` : The permissions a user should have to execute a command. `[Array(string)]`

`Command.reqBotPerms` : The permissions required for the bot to run the command.  `[Array(string)]`

 
##Credits:

[Discord.js](https://discord.js.org/#/) Discord.js is the node.js library used by this framework that allows interaction with the Discord API


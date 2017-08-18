# discordjs-bot-framework
A framework for discord bots, coded in javascript

## Author
Zeb Muller

## Installation:
Simply clone this repository into your node_modules.

## Use:

### Your main bot file
```javascript
const DFW = require("discordjs-bot-framework");

let TestBot = new DFW.Client({
author: "221568707141435393",
name: "Mildred",
prefix: "$$",
cmddir: require('path').join(__dirname, 'commands'),
token: "MzAwODI4MzIzNDQzOTAwNDE2.C80yQQ.abX_3G7GJr0QtvuhnMdoWQseuu0"
});

\t\t\tTestBot.login();

\t\t
```

## Credits:

[Smooth discord.js](https://github.com/KyeNormanGill/smooth-discord.js) - This similar bot framework was used as a reference for some things I was unsure of how to do (like all the module.exports stuff and some "path" and "fs" stuff)

# discordjs-bot-framework
A framework for discord bots, coded in javascript

##Author
\tZeb Muller

##Installation:
\tSimply clone this repository into your node_modules.

##Use:

\t###Your main bot file
\t\t```javascript
\t\t\tconst DFW = require("discordjs-bot-framework");

\t\t\tlet TestBot = new DFW.Client({
\t\t\t\tauthor: "221568707141435393",
\t\t\t\tname: "Mildred",
\t\t\t\tprefix: "$$",
\t\t\t\tcmddir: require('path').join(__dirname, 'commands'),
\t\t\t\ttoken: "MzAwODI4MzIzNDQzOTAwNDE2.C80yQQ.abX_3G7GJr0QtvuhnMdoWQseuu0"
\t\t\t});

\t\t\tTestBot.login();

\t\t```

##Credits:

\t[Smooth discord.js](https://github.com/KyeNormanGill/smooth-discord.js) - This similar bot framework was used as a reference for some things I was unsure of how to do (like all the module.exports stuff and some "path" and "fs" stuff)

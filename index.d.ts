declare module 'discordjs-bot-framework' {
  import Discord from 'discord.js'
export class Client{
constructor(options)
  
  public login():void
  public loadCommands():void
  public reloadCommands(identifier:String):Number
  public getArgs(msg:Discord.Message):Array<String>
  public findUser(msg:Discord.Message):Discord.User
}

export class Command{
  constructor(obj)
  
  public run():void
  public areYou(cmd:String):Boolean
}
  

}

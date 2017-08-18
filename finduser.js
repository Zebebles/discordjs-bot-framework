module.exports = function(){
    this.findUser = function(message, args){
          return message.client.users.get(args)
        || message.client.users.find(userino => userino.username.toLowerCase().includes(args.toLowerCase()))
        || message.mentions.users.first();
    }
}
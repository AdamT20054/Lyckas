const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { MessageEmbed } = require('discord.js');

module.exports = new Command()
    .setName('servers')
    .setGroup('Mod')
    .setType('Guild')
    .addPermissions('ADMINISTRATOR')
    
    .setCallback(async function(message, args, client) {
        
        let invite = await message.channel.createInvite({
            maxAge: 0, // 0 = infinite expiration
            maxUses: 0 // 0 = infinite uses
          }).catch(console.error);
        client.guilds.cache.forEach((guild) => {
            //console.log(`***${guild.name}***  has a total of ***${guild.memberCount}***  members.`)
            message.channel.send(
                `***${guild.name}***  has a total of ***${guild.memberCount}***  members. *Invite:*` //*${invite}*`
            )
        })
    })

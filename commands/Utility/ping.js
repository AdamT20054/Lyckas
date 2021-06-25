const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { MessageEmbed } = require('discord.js');

module.exports = new Command()
    .setName('ping')
    .setGroup('Utility')
    .setType('Guild')
    .addPermissions('')
    
    .setCallback(async function(message, args, client) {
        message.reply('Calculating ping...').then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp      
            resultMessage.edit(`Bot latency: ${ping}ms\nAPI Latency: ${client.ws.ping}ms`)
          })
        },
    )
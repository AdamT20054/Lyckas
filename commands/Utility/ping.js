const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { MessageEmbed } = require('discord.js');

module.exports = new Command()
    .setName('ping')
    .setGroup('Utility')
    .setType('Guild')
    .addPermissions('')
    
    .setCallback(async function(message, args, client) {
        message.channel.send(`I am online!`)
    })
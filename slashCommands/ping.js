// @ts-check

const { SlashCommand, SlashCommandOption } = require('@pat.npm.js/discord-bot-framework');
const { MessageEmbed } = require('discord.js');

module.exports = new SlashCommand()
    .setName('ping')
    .setDescription('Ping pong!')
    .setGuild('759176740429496332')
    .addOptions(
        new SlashCommandOption()
            .setName('name')
            .setDescription('Your name!')
            .setRequired(false)
            .setType('STRING')
    )
    .setCallback(function(interaction, command, client) {
        interaction.reply(`Pong!`);
    });
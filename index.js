// Lyckas by Adam (and Pat!)

// @ts-check

const { Client } = require('@pat.npm.js/discord-bot-framework');
const { Intents } = require('discord.js');
const { readdirSync } = require('fs');

const client = new Client({
    token: 'TOKEN',
    intents: Intents.ALL,
    partials: ['CHANNEL']
});

client.login();

client.once('ready', () => console.log('Lyckas online and ready!'));

client.commands
    .setPrefix('!')
    .indexDefaults()
    .indexGroups(readdirSync('./commands'))
    .indexCommands(...readdirSync('./commands').map(folder => readdirSync(`./commands/${folder}`).map(file => require(`./commands/${folder}/${file}`))));
const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { noop } = require('../../util.js');
const { default: axios } = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = new Command()
    .setName('news')
    .setGroup('Crypto')
    .setType('Guild')
    .addParameters(
        new Parameter()
            .setKey('coin')
            .setDescription('Choose what coin you want the bot to find news articles for.')
            .setRequired(false),
        new Parameter()
            .setKey('language')
            .setDescription('Choose the language you want the bot to find an article in:\nAR,DE,EN,ES,FR,HE,IT,NL,NO,PT,rRU,SE,UD,ZH')
            .setRequired(false)
    )
    .addPermissions('SEND_MESSAGES')
    .setCallback(async function(message, args, client) {
        const language = args.get('language')?.value.toLowerCase() || 'en';

        const coin = args.get('coin')?.value.toLowerCase() || 'crypto';

        const res = await axios.get(`https://newsapi.org/v2/everything?q=${coin}&apiKey=${process.env.NEWS_API_KEY}&pageSize=1&sortBy=publishedAt&language=${language}`).catch(noop);

        if (!res)
            return message.channel.send('You did not input a valid coin').catch(noop);

        // Destructure useful data from response
        const { title, source: { name }, description, url } = res.data.articles[0];

        new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp()
            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');


        message.channel.send(MessageEmbed).catch(console.error)
    });
const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { noop } = require('../../util.js');
const axios = require('axios');
const dotenv = require('dotenv');
const { MessageEmbed } = require('discord.js');
dotenv.config();

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
        try {
            
            
            const languagee = args.get('language')?.value || 'en';
            const language = languagee.toLowerCase();

            const coin = args.get('coin')?.value || 'crypto';

            const { data } = await axios.get(
              `https://newsapi.org/v2/everything?q=${coin}&apiKey=${process.env.NEWS_API_KEY}&pageSize=1&sortBy=publishedAt&language=${language}`
            );
      
            // Destructure useful data from response
            const {
              title,
              source: { name },
              description,
              url,
            } = data.articles[0];
      
          new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Latest news related to ${coin}`)
            .setURL(url)
            .setAuthor('https://1.bp.blogspot.com/-kqOAsduMzBM/Xw56Qkr-A7I/AAAAAAAAAoA/MccBaeM4zpQe6IHdND2J4pBYmnbnqV5ZACLcBGAsYHQ/w1200-h630-p-k-no-nu/ds.jpg', url)
            .setDescription(`Source: ${name}`)
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .addFields(
                { name: 'Article description:', value: `b${description}` },
                //{ name: '\u200B', value: '\u200B' },
                //{ name: 'Inline field title', value: 'Some value here', inline: true },
                //{ name: 'Inline field title', value: 'Some value here', inline: true },
            )
            //.addField('Inline field title', 'Some value here', true)
            //.setImage('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp()
            //.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
            
          message.reply({ embeds: [embed] });

          } catch (err) {
            console.log(err)
            return message.reply('There was an error, rate limited by API? Please try again later.');
          }
        })
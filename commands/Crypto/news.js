// @ts-check

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
              urlToImage,
              publishedAt,
              content,
            } = data.articles[0];
          let coinUP = coin.toUpperCase()
      
          let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${title}`)
            //.setURL(url)
            .setAuthor(`Latest news for ${coinUP}`)
            //.setDescription(`Source: ${name}`)
            //.addField({ name: `Published at:`, value: `${publishedAt}`, inline: true })
            //.setThumbnail(urlToImage)
            .addFields(
                { name: 'Article description:', value: `${description}` },
                //{ name: '----------------------' },
                { name: 'Article Content:', value: `${content}`, inline: true },
                //{ name: 'Inline field title', value: 'Some value here', inline: true },
            )
            //.addField('Inline field title', 'Some value here', true)
            .setImage(urlToImage)
            .setTimestamp()
            .setFooter(`${name}`, 'https://i.imgur.com/wSTFkRM.png');
            
          message.reply({ embeds: [embed] });
          console.log(urlToImage)
          } catch (err) {
            console.log(err)
            return message.reply('There was an error, rate limited by API? Please try again later.');
          }
        })
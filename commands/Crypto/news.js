// @ts-check

const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { noop } = require('../../util.js');
const axios = require('axios');

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
      
            return message.reply(
              `Latest news related to ${coin}:\n
              Title: ${title}\n
              Description:${description}\n
              Source: ${name}\n
              Link to full article: ${url}`
            );
          } catch (err) {
            return message.reply('There was an error, rate limited by API? Please try again later.');
          }
        })
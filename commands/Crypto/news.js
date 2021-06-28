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
            .setKey('query')
            .setDescription('Choose what query you want the bot to find news articles for.')
            .setRequired(false),
        new Parameter()
            .setKey('language')
            .setDescription('Choose the language you want the bot to find an article in:\nAR,DE,EN,ES,FR,HE,IT,NL,NO,PT,rRU,SE,UD,ZH')
            .setRequired(false)
    )
    .addPermissions('SEND_MESSAGES')
    .setCallback(async function(message, args, client) {
        try {


            // Takes input for langauge and converts it to lowercase so the API can use it, or defaults to 'en' if no input is given.
            const languagee = args.get('language')?.value || 'en';
            const language = languagee.toLowerCase();


            // Takes the string 'query' from the command to use in the API, if no coin is specified then its default query will be 'DeFi'.
            const query = args.get('query')?.value || `DeFi`;


            // Generate results for the given search query based on user inputs and saves it as the const 'data' to be used next.
            const { data } = await axios.get(
              `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API_KEY}&pageSize=1&sortBy=publishedAt&language=${language}`
            );
            // If this bit is red on VisualStudio dont worry, it still works 100% fine if you haven't changed anything that may of broken it.

            // Destructure useful data from the first article provided by the response (data.articles[0]) and turn them into usable variables for our embed response.
            const {
              title,
              source: { name },
              description,
              url,
              urlToImage,
              publishedAt,
            } = data.articles[0];
            // data.articles[0] is the first article, data.articles[1] is the 2nd, [3] is the 3rd and so on...


          // Construct the embed.
          let embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${title}`)
            .setURL(url)
            .setAuthor(`Lyckas News`)
            .setDescription(`*${description}*`)
            .setImage(urlToImage)
            .setTimestamp()
            .setFooter(`${name} | Published at ${publishedAt}`, 'https://gatehub.net/blog/content/images/2020/05/Crypto-desctiption-3.jpg');
          
          // Send the embed when the command is called.
          message.reply({ embeds: [embed], allowedMentions: { parse: [] } });

          // Catch any errors to stop the bot from crashing and going offline.
          } catch (err) {
            console.log(err)
            // Alert the user there was an error VIA a reply message.
            return message.reply(
              `**There was an error :(**\nCheck your query is **realistic**, maybe there are just no results? Try using a differen't language for your query?\n\nIf there are no results then consider joining the *support server* (**!support**) to get help and help us solve the issue!`
              );
          }
        })
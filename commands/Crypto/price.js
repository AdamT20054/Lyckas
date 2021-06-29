// @ts-check
const axios = require('axios');
const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { noop } = require('../../util.js');
const { MessageEmbed } = require('discord.js');


module.exports = new Command()
    .setName('price')
    .setGroup('Crypto')
    .setType('Guild')
    .addParameters(
        new Parameter()
            .setKey('coin')
            .setDescription('Choose what coin you want the price for.'),
        new Parameter()
            .setKey('currency')
            .setDescription('Choose the FIAT pair you want [GBP, USD ext]. This will default to USD if left blank')
            .setRequired(false)
    )
    .addPermissions('SEND_MESSAGES')
    .setCallback(async function(message, args, client) {
        try {

            // Takes the 'coin' value and makes it lowercase for the API to use.
            const coin = args.first().value.toLowerCase();
        
            // Takes the 'currency' value and assignes it as the 'VSCurrency' variables value, or uses usd as the 'VSCurrency' variables value if no value is provided
            const VSCurrency = args.get('currency')?.value.toLowerCase() || 'usd';

            // Grabbing all the data we need from the links and assigning each link's data a variable to use for our reply.
        
            const info = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${VSCurrency}&ids=${coin}&order=market_cap_desc&per_page=100&page=1&sparkline=false`).catch(noop);        
            // 



            // Checking to see if the coin provided is valid, this is the only check we need as the data is grabbed from the same variables in the URL.
            //if (!info)
            //    return message.reply(`**Could not find the coin you're looking for :(**\nMake sure you use its full name [Bitcoin, not BTC] and the currency is valid. If the issue still persists, do !support to join the support server!`).catch(noop);


            // Turning our raw data provided by the links into usable data.
            const {
                id,
                symbol,
                name,
                image,
                current_price,
                market_cap,
                market_cap_rank,
                fully_diluted_valuation,
                total_volume,
                high_24h,
                low_24h,
                price_change_24h,
            } = info;
            console.log(current_price, id, symbol, name, image, current_price, market_cap, market_cap_rank, fully_diluted_valuation, total_volume, high_24h,low_24h, price_change_24h,)
        


            // Checks to see if it has been given data to present, if no data is here then it will give an error message in chat.
            //if (!info[coin]?.[VSCurrency])
            //    return message.reply('Unable to fetch prices. Are you sure that coin and fiat pair exist?\nHere is an example of the command: *!price Bitcoin gbp*\n\n**PLEASE NOTE:** Abreviations are not implemented yet, please use the currencies full name.').catch(noop);


            // Constructing the embed that will hold the data and present it to the chat
            //let embed1 = new MessageEmbed()
            //    .setColor('#0099ff')
            //    .setTitle(`${current_price}`)
            //    .setURL('google.com')
            //    .setAuthor(`Lyckas News`)
            //    .setDescription(`*descriptio}*`)
            //    //.setImage(urlToImage)
            //    .setTimestamp()
            //    .setFooter(`footer`, 'https://gatehub.net/blog/content/images/2020/05/Crypto-desctiption-3.jpg');

        
        // Send the embed when the command is called.
        message.reply(`${current_price}`)
            //message.reply({ embeds: [embed1], allowedMentions: { parse: [] } }).catch(noop);
            } catch (err) {
                console.log(err)
                return message.reply('There was an error, rate limited by API? Please try again later.');
          }
        
    });
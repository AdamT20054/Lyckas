// Require dependencies
const { Client } = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios');
const { Command } = require('@pat.npm.js/discord-bot-framework');
// Load environment variables
dotenv.config();


module.exports = new Command()
  .setName('price')
  .setGroup('Crypto')
  .setType('Guild')
  .addPermissions('SEND_MESSAGES')

  .setCallback(async function(message, args, client) {
    // Get the params
    const [command, ...argss] = message.content.split(' ');

    // Check if there are two arguments present
    if (argss.length !== 2) {
        return message.reply(
            'You must provide the crypto and the currency to compare with!'
            );
    } else {
      const [coin, vsCurrency] = argss;
      const coin = coin.toLowerCase;
      try {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
          );

        if (!data[coin][vsCurrency]) throw Error();

        return message.reply(
          `The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`
          );            
      } catch (err) {
        return message.reply(
          `Please check your inputs. For example: !price bitcoin USD`
        );
        }
      }
    }
)
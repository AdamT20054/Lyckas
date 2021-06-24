// @ts-check

const { default: axios } = require('axios');
const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { noop } = require('../../util.js');

module.exports = new Command()
    .setName('price')
    .addAliases('coin')
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
        const coinn = args.first().value;
        const coin = coinn.toLowerCase();

        const VSCurrency = args.get('currency')?.value.toLowerCase() || 'usd';

        const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${VSCurrency}`).catch(noop);

        if (!res)
            return message.channel.send('Invalid currency or summat idk').catch(noop);

        const { data } = res;

        if (!data[coin]?.[VSCurrency])
            return message.channel.send('Unable to fetch prices. Are you sure that coin and fiat pair exist?\nHere is an example of the command: *!price Bitcoin gbp*').catch(noop);

        message.channel.send(`Current price of ${coin}***:***  ${data[coin][VSCurrency]} ${VSCurrency.toUpperCase()}`).catch(noop);
    });
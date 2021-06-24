// @ts-check

const { default: axios } = require('axios');
const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { noop } = require('../../util.js');

module.exports = new Command()
    .setName('price')
    .setGroup('Crypto')
    .setType('Guild')
    .addParameters(
        new Parameter()
            .setKey('coin')
            .setDescription('adam describe this param pls'),
        new Parameter()
            .setKey('currency')
            .setDescription('adam put description here pls')
            .setRequired(false)
    )
    .addPermissions('SEND_MESSAGES')
    .setCallback(async function(message, args, client) {
        const coin = args.first().value;
        const VSCurrency = args.get('currency')?.value || 'gbp';

        const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${VSCurrency}`).catch(noop);

        if (!res)
            return message.channel.send('Invalid currency or summat idk').catch(noop);

        const { data } = res;

        if (!data[coin]?.[VSCurrency])
            return message.channel.send('Oh no, look at this, an error!').catch(noop);

        message.channel.send(`The current price of 1 ${coin} = ${data[coin][VSCurrency]} ${VSCurrency.toUpperCase()}`).catch(noop);
    });
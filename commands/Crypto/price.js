// @ts-check
// @ts-ignore
const { default: axios } = require("axios");
const { Command, Parameter } = require("@pat.npm.js/discord-bot-framework");
const { noop } = require("../../util.js");
const { MessageEmbed } = require("discord.js");

module.exports = new Command()
    .setName("price")
    .setGroup("Crypto")
    .setType("Guild")
    .addParameters(
        new Parameter()
            .setKey("coin")
            .setDescription("Choose what coin you want the price for."),
        new Parameter()
            .setKey("currency")
            .setDescription(
                "Choose the FIAT pair you want [GBP, USD ext]. This will default to USD if left blank"
            )
            .setRequired(false)
    )
    .addPermissions("SEND_MESSAGES")
    .setCallback(async function (message, args, client) {
        // Takes the 'coin' value and makes it lowercase for the API to use.
        const coin = args.first().value.toLowerCase();

        // Takes the 'currency' value and assignes it as the 'VSCurrency' variables value, or uses usd as the 'VSCurrency' variables value if no value is provided
        const VSCurrency = args.get("currency")?.value.toLowerCase() || "usd";
        const VSCurrencyU = args.get("currency")?.value.toUpperCase() || "USD";
        const coin1U = coin.charAt(0).toUpperCase() + coin.slice(1);

        if (VSCurrencyU == "USD") {
            VSCurrencyUS = "$";
        }

        // Grabbing all the data we need from the links and assigning each link's data a variable to use for our reply.
        const res = await axios
            .get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${VSCurrency}&ids=${coin}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
            )
            .catch(noop);

        if (!res)
            return message
                .reply(
                    `**Could not find the coin you're looking for :(**\nMake sure you use its full name [Bitcoin, not BTC] and the currency is valid. If the issue still persists, do !support to join the support server!`
                )
                .catch(noop);

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
            price_change_percentage_24h,
            ath,
            ath_change_percentage,
            circulating_supply,
        } = res.data[0];

        const ath_change_percentage_normal = Number(
            ath_change_percentage.toFixed(2)
        );
        const price_change_24h_normal = Number(price_change_24h.toFixed(2));
        const price_change_percentage_24h_normal = Number(
            price_change_percentage_24h.toFixed(2)
        );

        //console.log(current_price, id, symbol, name, image, current_price, market_cap, market_cap_rank, fully_diluted_valuation, total_volume, high_24h,low_24h, price_change_24h);

        // Constructing the embed that will hold the data and present it to the chat
        let embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(`Current Price: __${current_price}${VSCurrencyUS}__`)
            //.setURL('https://gatehub.net/blog/content/images/2020/05/Crypto-desctiption-3')
            .setAuthor(`${coin1U} Price [${VSCurrencyU}]`)
            //.setDescription()
            .setThumbnail(`${image}`)
            .addFields({
                name: "Bitcoin stats:",
                value: `**24hr:** \`${price_change_24h_normal}$ (${price_change_percentage_24h_normal}%)\`\n**24hr High:** \`${high_24h}\`\n**24hr Low:** \`${low_24h}\`\n**ATH:** \`${ath}\`\n**Market Cap:** \`${market_cap} (${ath_change_percentage_normal}%)\`\n**Rank:** \`${market_cap_rank}\``,
            })
            .setTimestamp()
            .setFooter(
                `Support: discord.gg/NRgU4Ybk7V`,
                "https://i.imgur.com/CLAoaG9.png"
            );

        // Send the embed when the command is called.
        //message.reply(`${current_price}, ${market_cap}`)
        message.channel.send({ embeds: [embed] });
    });

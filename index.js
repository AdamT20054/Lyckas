// Lyckas by Adam (and Pat!)
// @ts-check
const { Client } = require("@pat.npm.js/discord-bot-framework");
const { Intents } = require("discord.js");
const { readdirSync } = require("fs");
const { noop } = require("./util.js");
const { default: axios } = require("axios");
require("dotenv").config();
const prefix = "$BTC";
const client = new Client({
    token: process.env.TOKEN,
    intents: Intents.ALL,
    partials: ["CHANNEL"],
});

client.login();

client.once("ready", () => {
    console.log("Lyckas online and ready!");
    client.user.setStatus("dnd");
    client.user.setActivity(
        `${prefix} help | ${client.guilds.cache.reduce(
            (a, b) => a + b.memberCount,
            0
        )} users across ${client.guilds.cache.size} servers!`,
        { type: "PLAYING" }
    );

    setInterval(async () => {
        const res = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
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

        const activities = [
            `Current Price: ${current_price}$ | ${prefix} help`,
            `24hr: ${price_change_24h_normal}$ (${price_change_percentage_24h_normal}%)`,
            `24hr High: ${high_24h}`,
            `24hr Low: ${low_24h}`,
            `Market Cap: ${market_cap}`,
            `Rank: ${market_cap_rank}`,
            `ATH: ${ath} (${ath_change_percentage_normal}%)`,
            `${prefix} help | ${client.guilds.cache.reduce(
                (a, b) => a + b.memberCount,
                0
            )} users across ${client.guilds.cache.size} servers!`,
        ];

        let i = 0;
        setInterval(
            () =>
                client.user.setActivity(
                    `${activities[i++ % activities.length]}`,
                    {
                        type: "PLAYING",
                    }
                ),
            17000
        );
    }, 120000);

    // Sets the bots name (not nickname) to the price every 31 mins - Discord has a max of 2 name changes per hour.
    //setInterval(async () => {
    //    const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&order=market_cap_desc&per_page=100&page=1&sparkline=false')
    //    const {
    //        current_price,
    //    } = res.data[0];
    //
    //    client.user.setUsername(`${current_price}$`);
    //}, 1860000);

    //const activities = [
    //    `${client.guilds.cache.size} servers!`,
    //    `${client.channels.cache.size} channels!`,
    //    `${prefix} help | ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users across ${client.guilds.cache.size} servers!`
    //];

    //let i = 0;
    //setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, {type: 'PLAYING'}), 15000);

    // @ts-ignore
    client.user.setStatus("dnd");

    readdirSync("./slashCommands").forEach((file) =>
        client.slashCommands.create(require(`./slashCommands/${file}`))
    );
});

client.commands
    .setPrefix("?")
    .indexDefaults()
    .indexGroups(readdirSync("./commands"))
    .indexCommands(
        ...readdirSync("./commands").map((folder) =>
            readdirSync(`./commands/${folder}`).map((file) =>
                require(`./commands/${folder}/${file}`)
            )
        )
    );

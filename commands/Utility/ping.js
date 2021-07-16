const { Command, Parameter } = require("@pat.npm.js/discord-bot-framework");
const { MessageEmbed } = require("discord.js");
const { default: axios } = require("axios");
module.exports = new Command()
  .setName("ping")
  .setGroup("Utility")
  .setType("Guild")
  .addPermissions("")

  .setCallback(async function (message, args, client) {
    const embed = new MessageEmbed()
      .setDescription("Checking the latency...")
      .setColor("#4287f5");
    message.channel.send({ embeds: [embed] }).then((embedMessage) => {
      setTimeout(async () => {
        const gecko = await axios.get("https://api.coingecko.com/api/v3/ping");
        const ping = embedMessage.createdTimestamp - message.createdTimestamp;
        if (gecko.status == "200") var geckoo = "Online";
        if (gecko.status != "200") var geckoo = "Offline";
        embed.setDescription(
          `Bot latency: ${ping}ms\nAPI Latency: ${client.ws.ping}ms\nCoingecko: ${geckoo}`
        );
        await embedMessage.delete().catch((error) => console.log(error));
        message.channel.send({ embeds: [embed] });
      }, 2000);
    });
  });

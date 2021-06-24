// @ts-check
const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { MessageEmbed } = require('discord.js');

module.exports = new Command()
    .setName('kick')
    .setGroup('Mod')
    .setType('Guild')
    .addPermissions('KICK_MEMBERS')
    .addParameters(
        new Parameter()
            .setKey('member')
            .setType('member')
            .setDescription('The ID of a member or the member mention.'),
        new Parameter()
            .setKey('reason')
            .setDescription('The reason for kicking the member')
            .setRequired(false)
    )
    .setCallback(async function(message, args, client) {
        const member = args.first().value;
        
        if (!member.kickable)
            return message.channel.send(`I cannot kick **${member.user.tag}** due to role hierarchy.`).catch(console.error);

        member.kick(args.get('reason') || 'No reason given')
            .then(kicked => {
                const embed = new MessageEmbed()
                    .setTitle('Member Banned')
                    .setThumbnail(member.user.displayAvatarURL())
                    .addField('User Banned', kicked.toString())
                    .addField('Kicked by', message.author.toString())
                    // @ts-ignore
                    .addField('Reason', args.get('reason') || `No reason given`)
                    .setFooter('Time kicked', client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send({ embeds: [embed] }).catch(console.error);
            })
            .catch(() => message.channel.send(`I was unable to kick **${member.user.tag}** due to an unknown error`).catch(console.error));
    });
        
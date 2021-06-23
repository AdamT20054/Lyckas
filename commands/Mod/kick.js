const { GuildCommand } = require('@pat.npm.js/discord-bot-framework');
const { MessageEmbed } = require('discord.js');
const { noop } = require('../../util');

module.exports = new GuildCommand()
    .setName('kick')
    .setGroup('Mod')
    .addPermissions('KICK_MEMBERS')
    .addParameters(
        {
            name: 'member',
            description: 'The ID of a member or the member mention',
            required: false
        },
        {
            name: 'reason',
            description: 'The reason for kicking the member',
            required: false
        }
    )
    .setCallback(async function(message, client, args) {
        const member = message.mentions.members.first() ?? await message.guild.members.fetch(args.get('member')).catch(noop);

        if (!member || !member.guild)
            return message.channel.send('You did not mention a member or provide a valid member ID.').catch(console.error);

        if (!member.kickable)
            return message.channel.send(`I cannot kick **${member.user.tag}** due to role hierarchy.`).catch(console.error);

        member.kick(args.get('reason') || 'No reason given')
            .then(kicked => {
                const embed = new MessageEmbed()
                    .setTitle('Member Banned')
                    .setThumbnail(member.user.displayAvatarURL())
                    .addField('User Banned', kicked.toString())
                    .addField('Kicked by', message.author.toString())
                    .addField('Reason', args.get('reason') || 'No reason given')
                    .setFooter('Time kicked', client.user.displayAvatarURL())
                    .setTimestamp();

                message.channel.send({ embed }).catch(console.error);
            })
            .catch(() => message.channel.send(`I was unable to kick **${member.user.tag}** due to an unknown error`).catch(console.error));
    });
        
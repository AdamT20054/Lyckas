const { GuildCommand } = require('@pat.npm.js/discord-bot-framework');
const { noop } = require('../../util');

module.exports = new GuildCommand()
    .setName('ban')
    .setGroup('Mod')
    .addPermissions('BAN_MEMBERS')
    .addParameters(
        {
            name: 'member',
            description: 'The ID of a member or the member mention',
            required: false
        },

        {
            name: 'time',
            description: 'The length of time the user should be banned for.',
            required: true
        },

        {
            name: 'reason',
            description: 'The reason for banning the member',
            required: false
        }
    )
    .setCallback(async function(message, client, args) {
        const member = message.mentions.members.first() ?? await message.guild.members.fetch(args.get('member')).catch(noop);

        if (!member || !member.guild)
            return message.channel.send('You did not mention a member or provide a valid member ID.').catch(console.error);

        if (!member.banable)
            return message.channel.send(`I cannot ban **${member.user.tag}** due to role hierarchy.`).catch(console.error);

        member.ban(args.get('reason') || 'No reason given')
            .then(banned => message.channel.send(`Kicked **${banned.user.tag}**`).catch(console.error))
            .catch(() => message.channel.send(`I was unable to ban **${member.user.tag}** due to an unknown error`).catch(console.error));
    });
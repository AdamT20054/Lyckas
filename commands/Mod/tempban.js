// @ts-check
const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');

module.exports = new Command()
    .setName('tempban')
    .setGroup('Mod')
    .setType('Guild')
    .addPermissions('BAN_MEMBERS')
    .addParameters(
        new Parameter()
            .setKey('member')
            .setType('member')
            .setDescription('The ID of a member or the member mention')
            .setRequired(false),
        new Parameter()
            .setKey('days')
            .setType('number')
            .setDescription('The number of days the user should be banned for')
            .setRequired(false),
        new Parameter()
            .setKey('reason')
            .setDescription('The reason for banning the member')
            .setRequired(false)
    )
    .setCallback(async function(message, args, client) {
        const member = args.first().value;

        if (!member.bannable)
            return message.channel.send(`I cannot ban **${member.user.tag}** due to role hierarchy.`).catch(console.error);

        member.ban({ reason: args.get('reason') || 'No reason given' })
            .then(banned => message.channel.send(`Kicked **${banned.user.tag}**`).catch(console.error))
            .catch(() => message.channel.send(`I was unable to ban **${member.user.tag}** due to an unknown error`).catch(console.error));
    });
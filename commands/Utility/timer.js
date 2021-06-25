const { Command, Parameter } = require('@pat.npm.js/discord-bot-framework');
const { MessageEmbed } = require('discord.js');
const seconds = 5
const startingCounter = 60
let counter = startingCounter
let importantData = ''

const fetchData = async () => {
  importantData = 'hello world'
}

const getText = () => {
  return `${importantData}\n\nUpdating in ${counter}s...`
}

const updateCounter = async (messagee) => {
  messagee.edit(getText())
  counter -= seconds

  if (counter <= 0) {
    counter = startingCounter
    await fetchData()
  }

  setTimeout(() => {
    updateCounter(messagee)
  }, 1000 * seconds)
}

module.exports = new Command()
    .setName('timer')
    .setGroup('Utility')
    .setType('Guild')
    .addPermissions('')
    
    .setCallback(async function(message, args, client) {        
        await fetchData()
        const guild = client.guilds.cache.first()
        const channel = guild.channels.cache.get('850281515610275863')

        const messagee = await channel.send(getText())
        updateCounter(messagee)
        


    });

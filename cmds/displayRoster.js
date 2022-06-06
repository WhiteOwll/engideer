module.exports = {
	name: 'displayroster',
    description: 'Edit an existing roster.',
    aliases: ['dr'],
	execute(Discord, client, config, message, args, func) {

        //if(message.member.id != 153561921524727809) return;

        if(!message.member.roles.cache.find(r => r.name === "Leader")) return message.channel.send(`You cannot use this command.`)

        let fs = require('fs')

        if(!args[0]) {
            return message.channel.send(`Display the roster in a channel.
            Usage: \`${config.prefix}displayroster <rosterName>\``)
        }
        fs.readdir(`./storage/rosters`, function (err, files) {
        let rName = args[0]
        let testString = files.join(' ').split('.json').join('')
        let re = new RegExp(`(\w*${rName}\w*)`);
        if(!testString.match(re)) {
            return message.channel.send(`Couldn't find a roster by that name`)
          }

          
          fs.readFile(`./storage/rosters/${rName}.json`, function(err, bruh) {
            let a = JSON.parse(bruh)
            a.guild = message.channel.guild.id
            a.channel = message.channel.id
            

            //build embed
            const embed = new Discord.MessageEmbed()
            embed.setTitle(`Roster ${rName}`)

            message.channel.send(`\`\`\`${bruh}\`\`\``)          
            .then(msg => {
                a.message = msg.id
            }).then(() => restore(a))

            //restore(a)

          })

        function restore (data) {

            fs.writeFile(`./storage/rosters/${rName}.json`, `${JSON.stringify(data)}`, function (err) {
                if (err) throw err;
              });

          }
        })
   
    }}
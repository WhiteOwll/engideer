module.exports = {
	name: 'newroster',
    description: 'Creates a new roster that can be displayed',
    aliases: ['newroster', 'nr', 'nr2'],
	execute(Discord, client, config, message, args, func) {
        if(!message.member.roles.cache.find(r => r.name === "Leader")) return message.channel.send(`You cannot use this command.`)
        let fs = require('fs')

        if(!args[0]) {
            return message.channel.send(`Create a new roster using this command. 
            Usage \`${config.prefix}newroster <rosterName>\`
            Once a roster is created, you can add players to it by using the \`${config.prefix}roster\` command.
            **Note: Use 3-4 letters for each roster, otherwise it may become confusing.**
            `)
        }

        fs.readdir(`./storage/rosters`, function (err, files) {
    
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //console.log(files)
            
            let testString = files.join(' ').split('.json').join('')
            let target = args[0]
            let re = new RegExp(`(\w*${target}\w*)`);
            if(testString.match(re)) {
                return message.channel.send(`A roster by that name already exists.`)
              }
            
              let roster = {}
              roster.guild = ''
              roster.channel = ''
              roster.message = ''
              roster.players = 0
              roster.mains = 0
              roster.subs = 0
              roster.others = 0 //?
              roster.mainPlayers = []
              roster.subPlayers = []
              roster.otherPlayers = []

              fs.writeFile(`./storage/rosters/${target.toLowerCase()}.json`, `${JSON.stringify(roster)}`, function (err) {
                if (err) throw err;
                if(err) return message.channel.send(`Couldn't create a roster.`)
                message.channel.send(`Created roster by the name ${target}.
                Update the roster using the \`${config.prefix}roster\` command.`)
              });
        })


    }}
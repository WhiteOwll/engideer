const Discord = require("discord.js");
const fs = require('fs');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_WEBHOOKS", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"] })
const config = require("./config");
const pool = require('./database/pool');
const func = require('./func');
const prefix = config.prefix;
const fetch = require('node-fetch');
const SourceQuery = require('sourcequery');
const table = require('easy-table')
/*const embed = new Discord.MessageEmbed() //embeds v12


*/

client.on("ready", function () {
  client.user.setActivity(`my sentery gan`, {type: 'WATCHING'});
console.log('I started at ' + new Date())
});

client.on('guildDelete', guild => {
  console.log(`I have left ${guild.name} at ${new Date()}`);
});

client.on('guildCreate', guild => {
  console.log(`I have Joined ${guild.name} at ${new Date()}`);

});

//command handler
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./cmds/${file}`);
  client.commands.set(command.name, command);
  console.log('Command ' + command.name + ' [' + command.aliases + ']' + ' loaded!')
}

client.on('messageCreate', message => {
  //const guild = message.guild.id;

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

try {
	command.execute(Discord, client, config, message, args, func);
} catch (error) {
	console.error(error);
	message.reply('I ran out of metal :[ (error)');
}



}
);

/*func.userAlvl(test)
function test(results) {
console.log(results)
}*/
client.on('messageCreate', message => {
  //const guild = message.guild.id;
  //bot mentioned
  if(message.content.startsWith(`<@!${client.user.id}>`)) {
    message.channel.send(`bep`)
    return;
  }

})
//connect/logs.tf/rcon(?)

//basically the main function of the bot. 
client.on('messageCreate', message => {

  //thanks payload-neo
let rawConnect = /connect (https?:\/\/)?(\w+\.)+\w+(:\d+)?; ?password .+/
if(message.content.match(rawConnect)) {
  let embed = new Discord.MessageEmbed()
  let connectInfo = message.content
  let parts = connectInfo.split(";")

  let ip = parts[0].replace(/^connect (https?:\/\/)?/, "")
  let ipNoPort = ip.split(':')[0]
  let port = ip.split(':')[1] || '27015'
  let password = parts.slice(1).join(';').replace(/"|;$/g, '').replace(/^ ?password /, '')

  //console.log(`${ip} ${ipNoPort} ${port} ${password}`)

  embed.setTitle(`steam://connect/${ip}/${encodeURIComponent(password)}`);

  let sq = new SourceQuery(1000)
  sq.open(ipNoPort, Number(port))
  sq.getInfo((err, info) => {
      if (err) {
          console.error(err)
          embed.setColor('#8b0000')
          embed.setDescription("Server is offline/Couldn't reach it")
      } else {
        //console.log(info)
          embed.setColor('#00FF00')
          embed.setDescription(`${info.name}\n${info.players}/${info.maxplayers} players\nMap: ${info.map}`)
      }

      message.channel.send(embed).then((m) => setTimeout(function(){ m.edit(embed) }, 1000))
  });

}

//logs dump
let matchLogs = /http(s|):\/\/(www\.|)logs\.tf\/\d+/
if(message.content.match(matchLogs)) {

  if(!message.channel.name.includes(config.logstf)) {
    return;
  }
  
  let logsID = message.content.match(/http(s|):\/\/(www\.|)logs\.tf\/\d+/) //logsID[0]

  let loneID = logsID[0].replace(/http(s|):\/\/(www\.|)logs\.tf\//, '')
  //console.log(loneID)


  fetch(`http://logs.tf/json/${loneID}`)
  .then(res => res.json())
  .then(json => {

      let a = [
          {'brah': 3},
          {'brah': 3},
      ]

      //https://zellwk.com/blog/looping-through-js-objects/
      //console.log(json.players)
      let info = []
      let names = Object.values(json.names)
      let i = 0
      const keys = Object.keys(json.names)
      for (const key of keys) {
      let e = {}
      e.id = key
      e.nick = `${names[i]}`
      info.push(e)
      //console.log(e)
      //console.log(key[0])

          i++
      }
      //console.log(json.players)
      //console.log(info)
      //console.log(info.length)
      const user = []
      //let sa = ['Name', 'Class', 'K', 'A', 'D', 'DMG', 'DMG/M', 'K/D', 'DT']
      //user.push(sa)
      for (i = 0; i < info.length; i++) {
          let userID = info[i].id
          let name
          if(info[i].nick.length > 12) {
              name = info[i].nick.slice(0, 12) + '..'
          } else {
              name = info[i].nick
          }
          //console.log(`${userID} is ${name}`)
          let merc = []
          let mapObj = {
              scout:"SCT",
              soldier:"SLD",
              pyro:"PYR",
              demoman:"DMO",
              heavyweapons:"HVY",
              engineer:"ENG",
              medic:"MED",
              sniper:"SNP",
              spy:"SPY" 
           };
          let stuff = Object.entries(json.players[userID])
          stuff[1][1].forEach((item) => {
              let cls = item.type
              cls = cls.replace(/scout|soldier|pyro|demoman|heavyweapons|engineer|medic|sniper|spy/gi, function(matched){
                  return mapObj[matched];
                });
              merc.push(cls)
          });

          let kills = stuff[2][1]
          let assist = stuff[4][1]
          let death = stuff[3][1]
          let damage = stuff[8][1]
          let dpm = stuff[16][1]
          let kd = stuff[7][1]
          let damageTaken = stuff[10][1]

          let team
          
          if(stuff[0][1] == 'Red') {
              team = 'R'
          } else {
              team = 'B'
          }

          let b = [name, merc, kills, assist, death, damage, dpm, kd, damageTaken, team]
          

          //user[`info${i}`] = b
          user.push(b)

        }
        //let bra = Object.entries(json.players['[U:1:149886332]'])
        //console.log(bra[1][1].length)

        //let stuff = Object.entries(json.players['[U:1:149886332]'])
        //console.log(stuff)

      let t = new table
          //['Name', 'Class', 'K', 'A', 'D', 'DMG', 'DMG/M', 'K/D', 'DT']
      user.forEach(function(item) {
      t.cell('(Team) Name', `(${item[9]}) ` + item[0])
      t.cell('Class', item[1].toString().replace(/,/gi, '|'))
      t.cell('Kills', item[2])
      t.cell('Assists', item[3])
      t.cell('Deaths', item[4])
      t.cell('Damage', item[5])
      t.cell('DM/M', Number(item[6]))
      t.cell('K/D', item[7])
      t.cell('DT', item[8])
      t.newRow()
      t.sort(['DM/M|des'])
      })
      //t.sort('Kills|des') //sorts descending order
      //console.log(t.toString())
      message.channel.send(`\`\`\`\n${t.toString()}\nSorted by DM/M\`\`\``)
      //message.channel.send(`${t.toString()}`)



      //console.log(user)



  });

}



})
client.on("guildMemberAdd", function(member) {
  let guild = member.guild;
  let guest = guild.roles.cache.find(role => role.name === "Ringer/Guest");
  //member.roles.add(guest);
});

//join message
client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
          guild.channels.cache.find(channel => channel.name === config.logs).send(
            new Discord.MessageEmbed()
            .setTitle('Member Joined - ' + member.user.tag)
            .setColor(0x3CB371)
            .setFooter('Member ID: ' + member.id)
            .setThumbnail(member.user.avatarURL())
            .setTimestamp()
            //.setDescription('Member ' + member.user.username + ' has joined the server!')
            //.addField('Account created', member.user.createdAt , false)
          )
});
//leave message
client.on("guildMemberRemove", (member) => {
  //console.log(member.guild)
  const guild = member.guild;
    guild.channels.cache.find(channel => channel.name === config.logs).send(
      new Discord.MessageEmbed()
      .setTitle('Member Left - ' + member.user.tag)
      .setColor(0xDC143C)
      .setFooter('Member ID: ' + member.id)
      .setThumbnail(member.user.avatarURL())
      .setTimestamp()
      //.setDescription('Member ' + member.user.username + ' has left the server.')
    )
});

//message edited
client.on("messageUpdate", function(oldMessage, newMessage){
  if(oldMessage.author.bot) return;
const guild = oldMessage.guild;
  //console.log(oldMessage.content + ' ' + newMessage.content)
if(oldMessage.content == newMessage.content) {
  return;
}

if(oldMessage === null || newMessage === null) {
  return;
}
var old = oldMessage.content
var newm = newMessage.content
if(oldMessage.content.length > 1020 || newMessage.content.length > 1020) {
  old = 'Too long. Could not display.'
  newm = 'Too long. Could not display.'
} 

guild.channels.cache.find(channel => channel.name === config.logs).send(
  new Discord.MessageEmbed()
  .setDescription(`${oldMessage.channel}` + `  [Jump to message](https://discordapp.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`)
  .setColor(0x5f9ea0)
  .setFooter('ID: ' + oldMessage.id)
  .setAuthor('Message Edited - ' + oldMessage.member.user.tag, oldMessage.member.user.avatarURL())
  .setTimestamp()
  .addField('Before', '** **' + old, false)
  .addField('After', '** **' + newm, false)
)
})

//User nickname update
client.on("guildMemberUpdate", function(oldM, newM){
  
  const guild = oldM.guild;
  if(oldM.nickname === newM.nickname) return;
  var oldNick = oldM.nickname;
  var newNick = newM.nickname;
  //old name
  if(!oldNick){
    oldNick = 'None'
  }
  //new name
  if(!newNick) {
    newNick = 'None'
  }



  guild.channels.cache.find(channel => channel.name === config.logs).send(
    new Discord.MessageEmbed()
    .setAuthor('Nickname Updated - ' + oldM.user.tag, oldM.user.avatarURL())
    .setColor(0x5f9ea0)
    .setFooter('Member ID: ' + oldM.id)
    .setTimestamp()
    .setDescription(oldM.user.tag + ' had their nickname updated')
    .addField('Before', oldNick, false)
    .addField('After', newNick, false)
  )
});

//Role added/removed
client.on("guildMemberUpdate", function(oldMember, newMember){
  const guild = oldMember.guild
  var old = oldMember._roles
  var next = newMember._roles
  if(old.length < next.length) { //recevied role
    var check = 'give';
    findDiffence(old, next, check)
  } else if(old.length > next.length) { //lost role
    var check = 'take';
    findDiffence(old, next, check)
    
  } else {
    return;
  }
    function addedRole(diff) {
    guild.channels.cache.find(channel => channel.name === config.logs).send(
    new Discord.MessageEmbed()
    .setAuthor('Role added - ' + oldMember.user.tag, oldMember.user.avatarURL())
    .setColor(0x40e0d0)
    .setFooter(`Member ID:` + oldMember.id)
    .setTimestamp()
    .setDescription(oldMember.user.tag + ' was given the ' + '<@&' + diff + '> role.')
    )
  }
  function removeRole(diff) {
    guild.channels.cache.find(channel => channel.name === config.logs).send(
    new Discord.MessageEmbed()
    .setAuthor('Role removed - ' + oldMember.user.tag, oldMember.user.avatarURL())
    .setColor(0x40e0d0)
    .setFooter(oldMember.id)
    .setTimestamp()
    .setDescription(oldMember.user.tag + ' lost the ' + '<@&' + diff + '> role.')
    )
  }
  //did not make this lul. Someone else did online.
  function findDiffence (a1, a2, check) {

  var a = [], diff = [];

  for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
  }

  for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
          delete a[a2[i]];
      } else {
          a[a2[i]] = true;
      }
  }

  for (var k in a) {
      diff.push(k);
  }
  if(check == 'give') {
    addedRole(diff)
  } else if (check == 'take') {
    removeRole(diff)
  } else {
    return;
  }
}
});

//message delete
client.on('messageDelete', async (message) => { 
  
  if(message.author.bot) return;


  const logs = message.guild.channels.cache.find(channel => channel.name === config.logs);
  const embed = new Discord.MessageEmbed()
  embed.setAuthor('Message Deleted - ' + message.author.tag, message.author.avatarURL())
  embed.setColor(0xEE7600)
  embed.setTimestamp()
  if(message.content.length > 1000) {
    embed.setDescription("**Message deleted in " + `${message.channel}` + "**\nToo long to display.", false)
  } else {
    //if(!message.content) return;
    embed.setDescription("**Message deleted in " + `${message.channel}` + "**\n" + message.content, false)
  }
  //console.log(message.attachments.first())
  if(message.attachments.first()) {
    embed.setImage(`${message.attachments.first().proxyURL}`)
    //console.log(message.attachments.first().proxyURL)
  }

  embed.setFooter('Author ID: ' + message.author.id + ' | Message ID: ' + message.id)
  logs.send({embed});
})

//Have a dummy text file to communicate from the discord bot to the server. A command writes the user input in the folder and sends it to the server where it can read it and execute it
//watch for updates. Store the things in here, send them if needed.
fs.watch(`./storage/rosters`, (eventType, filename) => {
  
});

client.login(config.token); //Hello World
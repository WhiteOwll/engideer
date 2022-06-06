module.exports = {
	name: 'test',
    description: 'test',
    aliases: ['test', 'owl'],
	execute(Discord, client, config, message, args, func) {



        if(message.member.id != 153561921524727809) return;
        let fs = require('fs');
















        /*
        const fetch = require('node-fetch');
        const table = require('easy-table')

        let logsID = args[0].match(/http(s|):\/\/(www\.|)logs\.tf\/\d+/) //logsID[0]

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
              let bra = Object.entries(json.players['[U:1:149886332]'])
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
            t.cell('DM/M', item[6])
            t.cell('K/D', item[7])
            t.cell('DT', item[8])
            t.newRow()
            })
            //t.sort('Kills|des') //sorts descending order
            //console.log(t.toString())
            message.channel.send(`\`\`\`\n${t.toString()}\`\`\``)
            //message.channel.send(`${t.toString()}`)



            //console.log(user)



        });
        */

    }}
module.exports = {
	name: 'rr',
    description: 'Edit an existing roster.',
    aliases: ['roster'],
	execute(Discord, client, config, message, args, func) {
        if(!message.member.roles.cache.find(r => r.name === "Leader")) return message.channel.send(`You cannot use this command.`)
        let fs = require('fs')

        if(!args[0]) {
            return message.channel.send(`Edit an existing roster.
            Usage: \`${config.prefix}roster <rosterName> <add|remove> <user> <main|sub|other> <class>\`
            `)
        }

        let rName = args[0]
        let action = args[1]
        let user = args[2]
        let type = args[3]
        let merc = args[4]

        let errorMap = {
            "classNoExist": "Class doesn't exist.",
            "type": "No such type (main/sub/other).",
            "case": "No such action.",
            "specifyClass": "Specify a class",
            "noUser": "No valid user was provided",
        }
        let mem;
        let a;
        if(!user) {
            return message.channel.send(errorMap.noUser)
        } else {
            const userMention = message.mentions.users.first();
            //mention
            if (userMention) {
               mem = message.guild.member(userMention);
                a = mem.user
              //id
            } else if (user) {
                
                  let check = client.users.cache.find(u => u.username.toLowerCase().includes(user.toLowerCase()));
                  //console.log(Object.entries(check))
                  if(check) {
                    let e = Object.entries(check)
                    mem = message.guild.members.cache.get(e[0][1]);
                    //console.log(mem.user)
                    //console.log(mem.user)
                    a = mem.user
                  //console.log(member)
                  if(!mem) {
                  return message.channel.send('Invalid user.')
                  }
                }
            }
        }
        //console.log(a)
        let b = Object.entries(a)

        fs.readdir(`./storage/rosters`, function (err, files) {
    
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //console.log(files)
            
            let testString = files.join(' ').split('.json').join('')
            let re = new RegExp(`(\w*${rName}\w*)`);
            if(!testString.match(re)) {
                return message.channel.send(`Couldn't find a roster by that name`)
              }

              
              fs.readFile(`./storage/rosters/${rName}.json`, function(err, bruh) {
                let roster = JSON.parse(bruh)
                //console.log(roster)
                
                switch (action) {
                    case "add":
                        if(!merc) return message.channel.send(errorMap.specifyClass)
                        if(type == 'main') {//main

                            if(roster.mainPlayers) {
                                
                                let obj = {"merc": `${merc}`,"userID":`${b[0][1]}`,"userTag":`${b[2][1] + `#` + b[3][1]}`}
                                roster.mainPlayers.push(obj)

                            }
                            message.channel.send(`Roster updated! ${b[2][1]} is now rostered in ${rName} as a ${type} ${merc}`)
                            roster.players++
                            roster.mains++

                            restore(roster)
                        } else if(type == 'sub') {//sub

                            if(roster.subPlayers) {

                                let obj = {"merc": `${merc}`,"userID":`${b[0][1]}`,"userTag":`${b[2][1] + `#` + b[3][1]}`}
                                roster.subPlayers.push(obj)

                            }
                            message.channel.send(`Roster updated! ${b[2][1]} is now rostered in ${rName} as a ${type} ${merc}`)
                            roster.players++
                            roster.subs++

                            restore(roster)
                        } else if(type == 'other') {//other
                            
                            if(roster.otherPlayers) {

                                let obj = {"merc": `${merc}`,"userID":`${b[0][1]}`,"userTag":`${b[2][1] + `#` + b[3][1]}`}
                                roster.otherPlayers.push(obj)

                            }
                            message.channel.send(`Roster updated! ${b[2][1]} is now rostered in ${rName} as a ${type} ${merc}`)
                            roster.players++
                            roster.others++

                            restore(roster)
                        } else {//none
                            return message.channel.send(errorMap.type)
                        }

                    break;
                    case "remove":

                        

                        if(type == 'main') {//main

                            //console.log(removeByAttr(roster.mainPlayers, 'userID', `${b[0][1]}`))
                            removeByAttr(roster.mainPlayers, 'userID', `${b[0][1]}`)
                            roster.players--
                            roster.mains--
                            message.channel.send(`Roster updated! ${b[2][1]} has been removed from ${rName} (${type})`)
                            restore(roster)
                        } else if(type == 'sub') {//sub

                            removeByAttr(roster.subPlayers, 'userID', `${b[0][1]}`)

                            roster.players--
                            roster.subs--
                            message.channel.send(`Roster updated! ${b[2][1]} has been removed from ${rName} (${type})`)
                            restore(roster)
                        } else if(type == 'other') {//other
                            
                            removeByAttr(roster.otherPlayers, 'userID', `${b[0][1]}`)

                            roster.players--
                            roster.others--
                            message.channel.send(`Roster updated! ${b[2][1]} has been removed from ${rName} (${type})`)
                            restore(roster)
                        } else {//none
                            return message.channel.send(errorMap.type)
                        }

                    break;
                    default:
                      message.channel.send(errorMap.case)
                  }

              })
              function restore (data) {

                fs.writeFile(`./storage/rosters/${rName}.json`, `${JSON.stringify(data)}`, function (err) {
                    if (err) throw err;
                  });

              }

              function removeByAttr (arr, attr, value) {
                let i = arr.length;
                while(i--){
                   if( arr[i] 
                       && arr[i].hasOwnProperty(attr) 
                       && (arguments.length > 2 && arr[i][attr] === value ) ){ 
            
                       arr.splice(i,1);
            
                   }
                }
                return arr;
            }


              /*let roster = {}
              roster.players = 0
              roster.mains = 0
              roster.subs = 0
              roster.others = 0 //?
              roster.mainPlayers = {}
              roster.subPlayers = {}
              roster.otherPlayers = {}

              fs.writeFile(`./storage/rosters/${target}.json`, `${JSON.stringify(roster)}`, function (err) {
                if (err) throw err;
              });*/
        })


    }}
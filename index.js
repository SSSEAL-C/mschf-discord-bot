const axios = require('axios');
const cheerio = require("cheerio");
DTOKEN="token"
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const { MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const fs = require('fs');
const prefix = "ms!"
client.on("ready", () => {
    client.user.setStatus("online")
    client.user.setActivity(`ms!help | Mystifying ${client.guilds.cache.size} users...`)
    console.log('Bot Ready!')
})
client.on('messageCreate', async message => {
    const loading = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Loading...")
        .setDescription("Loading...")
        .setFooter('Made by SSSEAL-C')
        .setTimestamp()
    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase()

    if (command === "help" || command === "info") {

        const botinfo = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle("MSCHF")
            .setThumbnail('https://www.mschf.xyz/_nuxt/img/icon_about@3x.9c450d6.png')
            .addField(':busts_in_silhouette: Creators', "realsovietseal#0001", true)
            .addField(':keyboard: Commands', "```ini\n"+prefix+"help - Displays this embed\n"+prefix+"current - Displays current active MSCHF event\n"+prefix+"\nhistory - Shows the previous MSCHF events```", false)
            .setFooter('Made by SSSEAL-C')
            .setURL('https://mschf.xyz')
            .setTimestamp()

        message.channel.send({ embeds: [botinfo] });

    }
    if (command === "ping") {
        const date = new Date();
        const embed1 = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Bot Ping")
        .addFields(
            {name:
                ":chart_with_upwards_trend: Latency :chart_with_upwards_trend:",
              value: "Pinging..."},
              {name: ":bar_chart: API Latency :bar_chart:",
              value: "Pinging..."}
            )
        .setTimestamp()
        .setFooter('Made by SSSEAL-C')
        var msg = await message.channel.send({embeds:[embed1]
            
          }).catch((err) => {
              console.error(err);
              message.channel.send("There seems to have been an error. Please contact the bot owner, beforehand check if the bot has these permissions https://discordapi.com/permissions.html#339078231")
          });
          const date2 = new Date();
          var latency = `${Math.floor(
            msg.createdTimestamp - date2
          )}ms`;
            var apilatency = `${Math.round(client.ws.ping)}ms`;
            const embed2 = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Bot Ping")
        .setFooter('Made by SSSEAL-C')
        .addFields(
            {name:
                ":chart_with_upwards_trend: Latency :chart_with_upwards_trend:",
              value: latency},
              {name: ":bar_chart: API Latency :bar_chart:",
              value: apilatency}
            )
        .setTimestamp()

            await msg.edit({embeds:[embed2]
            
            }).catch((err) => {
                  console.error(err);
                  message.channel.send("There seems to have been an error. Please contact the bot owner, beforehand check if the bot has these permissions https://discordapi.com/permissions.html#339078231")
              });
    }
    if (command === "current") {
        const msg = await message.channel.send({embeds:[loading]})
        axios
        .get("https://mschf.xyz/")
        .then(async (response) => {
            // parse html with cheerio
            $=cheerio.load(response.data)
            // parse current project data
            currentproj={}
            innerHTML = $('a.project-current').html()
            innerHTMLtext = $(innerHTML).text().split('\n')
            currentproj.number=innerHTMLtext[0].replace(/\s/g, "")
            currentproj.name=innerHTMLtext[1].split(' ').filter(n => n).join(" ")
            currentproj.link = $('a.project-current').attr().href
            axios
            .get(currentproj.link)
            .then(async (response) => {
                $=cheerio.load(response.data)
                current={}
                current.desc = $('meta[name=og:description]').attr().content
                current.img = $('meta[name=og:image]').attr().content
                current.ico = $('link[rel=apple-touch-icon]').attr().href
                current.simple = currentproj.link.split("?")[0]
                current.ico=current.simple+current.ico
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(currentproj.number+" - "+currentproj.name)
                .setURL(currentproj.link)
                .setDescription(current.desc)
                .setThumbnail(current.ico)
                .setImage(current.img)
                .setFooter('Made by SSSEAL-C')
                .setTimestamp();
                await msg.edit({embeds:[embed]})
            })
            .catch((err) => console.log("Fetch error ("+currentproj.link+") " + err));
        }).catch((err) => console.log("Fetch error (mschf.xyz)" + err));
    }
    if (command === "next") {
        const msg = await message.channel.send({embeds:[loading]})
        await axios
        .get("https://mschf.xyz/")
        .then(async (response) => {
            // parse html with cheerio
            $=cheerio.load(response.data)
            // parse next project data
            nextproj={}
            innerHTML = $('div.near').html()
            console.log(innerHTML)
        }).catch((err) => console.log("Fetch error (mschf.xyz)" + err));
    }
    if (command === "history") {
        const msg = await message.channel.send({embeds:[loading]})
        axios
        .get("https://mschf.xyz/")
        .then(async (response) => {
            msdata={}
            // parse html with cheerio
            $=cheerio.load(response.data)
            // parse current project data
            currentproj={}
            innerHTML = $('a.project-current').html()
            innerHTMLtext = $(innerHTML).text().split('\n')
            currentproj.number=innerHTMLtext[0].replace(/\s/g, "")
            currentproj.name=innerHTMLtext[1].split(' ').filter(n => n).join(" ")
            currentproj.link = $('a.project-current').attr().href
            msdata.current=currentproj
            // all projects
            projects={}
            // get all projects and split names and numbers
            allprojectsname=$('div.list-group').text().split(' ').filter(n => n).join(" ").split("+")
            // remove final element from array
            allprojectsname=allprojectsname.splice(0,allprojectsname.length-1)
            // reparse final element
            current=($('div.list-group').text().split(' ').filter(n => n).join(" ").split("+"))[allprojectsname.length].split('\n')
            current.number=current[0].substring(1)
            current.name=current[1].substring(1)
            current=current.number+current.name
            allprojectsname.push(current)
            projects.names=allprojectsname
            projectsarray=[]
            // parse all projects
            projects.names.forEach(function(item){
                if (item.includes('\n')) {
                    // fix items with XXXX name creating incorrect names
                    item=item.split('\n')
                    fixed1=item[0]+item[1]
                    fixed1=fixed1.split(" ")
                    fixed1=fixed1.filter(n => n).join(" ")
                    fixed2=item[2]
                    fixed2=fixed2.split(" ")
                    fixed2=fixed2.filter(n => n).join(" ")
                    projectsarray.push(fixed1)
                    projectsarray.push(fixed2)
                    return
                }
                item=item.split(" ")
                item=item.filter(n => n).join(" ")
                projectsarray.push(item)
            })
            projects.names=[]
            count=0
            projectsarray.forEach(function(item){
                item=item.split(" ")
                item.number=item[0]
                if (item.length===1){
                    // check for empty names
                    item.name=" "
                } else {
                    // Fix names with more than one word
                    partcount=0
                    partreturn=[]
                    item.forEach(function(part){
                        if (partcount === 0) {
                            partcount++
                            return
                        } else {
                            partreturn.push(part)
                            partcount++
                            return
                        }
                        
                    })
                    item.name=partreturn.join(" ")
                }
                projects.names.push({"name":item.name,"number":item.number})
                count++
            })
            msdata.projects=projects.names
            msdata.projarray=[]
            msdata.projects.forEach(async function(item){
                fixed = item.number + " - "+item.name
                msdata.projarray.push(fixed)
            })
            if (msdata.projarray.join("\n").length >= 1024) {
                msdata.string=msdata.projarray.join("\n").substring(0,1014)
                msdata.string2=msdata.projarray.join("\n").substring(1014,2038)
                if (msdata.projarray.join("\n").length >= 2048) {
                    msdata.string3=msdata.projarray.join("\n").substring(2038,3062)
                    if (msdata.projarray.join("\n").length >= 3072) {
                        msdata.string3=msdata.projarray.join("\n").substring(3062,4086)
                        const embed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setTitle("MSCHF.XYZ History")
                        .addFields({name:"⠀",value:"```\n"+msdata.string+"```",inline:false},{name:"⠀",value:"```\n"+msdata.string2+"```",inline:false},{name:"⠀",value:"```\n"+msdata.string3+"```",inline:false},{name:"⠀",value:"```\n"+msdata.string4+"```",inline:false})
                        .setTimestamp()
                        await msg.edit({embeds:[embed]})
                        return
                    }
                    
                    const embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("MSCHF.XYZ History")
                    .addFields({name:"⠀",value:"```\n"+msdata.string+"```",inline:false},{name:"⠀",value:"```\n"+msdata.string2+"```",inline:false},{name:"⠀",value:"```\n"+msdata.string3+"```",inline:false})
                    .setTimestamp()
                    await msg.edit({embeds:[embed]})
                    return
                }
                const embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("MSCHF.XYZ History")
                    .addFields({name:"⠀",value:"```\n"+msdata.string+"```",inline:false},{name:"⠀",value:"```\n"+msdata.string2+"```",inline:false})
                    .setTimestamp()
                    await msg.edit({embeds:[embed]})
                    return
                
            } else {
                msdata.string=msdata.projarray.join("\n")
                const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("MSCHF.XYZ History")
                .addFields({name:"History :scroll:",value:"```\n"+msdata.string+"```",inline:false})
                .setTimestamp()
                await msg.edit({embeds:[embed]})
                return
            }
        })
        .catch((err) => console.log("Fetch error " + err));
    }
})
/*
});


client.on('interactionCreate', async interaction => {
if (!interaction.isCommand()) return;
const { command } = interaction;
if (interaction.commandName === 'current') {
    
    }
    if (interaction.commandName === 'history') {
        
    }
});*/
client.login(DTOKEN);
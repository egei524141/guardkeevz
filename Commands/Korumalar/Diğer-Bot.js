const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db');
const Config = require("../../Configuration/Settings.json");
const Salvo_Config = require("../../Configuration/Config.json");

exports.run = async (client, message, args) => {
  
let salvoembed = new Discord.MessageEmbed().setColor(Config.Embed.Color).setFooter(Config.Embed.Footer).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))
if (message.author.id !== Salvo_Config.Bot.Owner) return message.channel.send(salvoembed.setDescription(`Bu Komutu Sadece <@!${Salvo_Config.Bot.Owner}> Kullanabilir.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
let botkoruma = await message.channel.send(salvoembed.setDescription(`**__Bot Koruma;__**

Bu işlemi kabul ederseniz whitelistte olan kullanıcılar haricinde 
sunucuya bot ekleyen herkes engellenecektir.

✅ : \`Aktif Et\`, ❎ : \`Pasif Bırak\`, 🗑️ : \`İptal Et\`
`))
botkoruma.react("✅").then(() => botkoruma.react("❎")).then(() => botkoruma.react("🗑️"));
const filter = (reaction, user) => {
return(
    ["✅","❎","🗑️"].includes(reaction.emoji.name) &&
    user.id === message.author.id
);
}
botkoruma.awaitReactions(filter, {max: 1, time: 120000, errors: ["time"]})
.then((collected) => {
const reaction = collected.first();
if (reaction.emoji.name === "✅") {
    botkoruma.edit(salvoembed.setColor("RANDOM").setDescription(`Bot Koruma Başarılı Bir Şekilde Aktif Edildi.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
    botkoruma.reactions.removeAll().catch(error => console.error("Bir Hata Oluştu: : ", error));
  
    aktifEt();
} else if (reaction.emoji.name === "❎") {
    botkoruma.edit(salvoembed.setColor("RANDOM").setDescription(`Bot Koruma Başarılı Bir Şekilde Pasif Bırakıldı.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
    botkoruma.reactions.removeAll().catch(error => console.error("Bir Hata Oluştu: : ", error));
    
    pasifEt();
} else if (reaction.emoji.name === "🗑️") {
    botkoruma.edit(salvoembed.setColor("RANDOM").setDescription(`İşleminiz İptal Edildi.`)).then(m => m.delete({timeout: Config.Embed.Timeout}));
    botkoruma.reactions.removeAll().catch(error => console.error("Bir Hata Oluştu: : ", error));
    
} 
})

const aktifEt = async () => {
    db.set(`${message.guild.id}_botkoruma`, "aktif")
};

const pasifEt = async () => {
    db.delete(`${message.guild.id}_botkoruma`)
};

};
exports.conf = {
  aliases: ['bot-koruma'],
  permLevel: 0
};

exports.help = {
  name: 'bot-koruma',
  description: 'Salvatore was here',
  usage: 'bot-koruma'
};
const FormData = require('form-data');
const axios = require('axios');
const { Telegraf } = require('telegraf')
const config = require('./config.json')

const bot = new Telegraf(config.BOT_TOKEN)

const removeBg = async function (url) {

  const formData = new FormData();
  formData.append('image_url', url)

  const res = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {

    headers: {...formData.getHeaders(), 'X-Api-Key': config.REMOVE_BG_TOKEN},
    responseType: 'arraybuffer'
  })

  return res.data

}

bot.start((ctx) => ctx.reply('Hello ' + ctx.message.from.first_name))
bot.help((ctx) => ctx.reply('Send Me A Photo I Can Help You To Remove Your Background Typr /start To Start The Bot'))



bot.on('photo', async (ctx) => {

  const file_id = ctx.update.message.photo[ctx.update.message.photo.length - 1].file_id
  const file_path = (await ctx.telegram.getFile(file_id)).file_path
  const url = `https://api.telegram.org/file/bot${config.BOT_TOKEN}/${file_path}`


  const photo = await removeBg(url)
  ctx.replyWithDocument({ source: photo, filename: 'RemoveBG.png' })
  
})

bot.launch()

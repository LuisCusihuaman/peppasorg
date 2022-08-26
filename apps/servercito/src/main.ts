import * as express from 'express';
import {Context, Telegraf} from "telegraf";
import {stopInstancePubSub, startInstancePubSub} from './gcp'
import {GiphyFetch} from "@giphy/js-fetch-api";
import fetch from "node-fetch";


const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const gf = new GiphyFetch(process.env.GIPHY_TOKEN)
declare let global;
global.fetch = fetch


async function getRandomGif(keyword: string) {
  const min = 0;
  const max = 15;
  const startGifsSearch: number = Math.floor(min + Math.random() * (max - min + 1))
  const {data: gifs} = await gf.search(keyword, {
    sort: 'relevant',
    lang: 'es',
    limit: max,
    type: 'gifs',
    offset: startGifsSearch
  })
  return gifs[Math.floor(Math.random() * gifs.length)];
}

bot.start(async (ctx: Context) => {
  await ctx.reply("Hola wuachinn machin")
})


bot.command('prender_servercito', async (ctx: Context) => {
  const event = {"zone": "southamerica-east1-b", "label": "env=minecraft"}
  const data = {"data": Buffer.from(JSON.stringify(event)).toString('base64')}
  await ctx.reply("Prendiendo el servercito... 🙏")
  await startInstancePubSub(data, async () => {
    await ctx.reply('Prendiste el servercito 💚')
    const gamingGif = await getRandomGif("gaming")
    await ctx.replyWithAnimation(gamingGif.images.fixed_height)
  });
});


bot.command('apagar_servercito', async (ctx: Context) => {
  const event = {"zone": "southamerica-east1-b", "label": "env=minecraft"}
  const data = {"data": Buffer.from(JSON.stringify(event)).toString('base64')}
  await ctx.reply("Apagando el servercito... 🤞")
  await stopInstancePubSub(data, async () => {
    await ctx.reply('Apagaste el servercito 😪')
    const sleepingGif = await getRandomGif("sleeping")
    await ctx.replyWithAnimation(sleepingGif.images.fixed_height)
  })
})

bot.hears(/\bminecra|dragon|juegan|juga|game|meme.*\b/, async (ctx: Context) => {
  const responses = ["NO", "No", "TOY CHIQUITA 😪", "NI EMPEDO", "Obvio perro", "Si", "SI", "💚", "💔"];
  const randResponse = responses[Math.floor(Math.random() * responses.length)];
  await ctx.reply(`${randResponse}`);
});

const port = process.env.port || 8443;
const server = app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}`);
  await bot.launch()
});
server.on('error', console.error);

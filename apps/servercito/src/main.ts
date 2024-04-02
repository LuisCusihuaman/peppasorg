import * as express from 'express';
import { Context, Telegraf } from 'telegraf';
import { stopInstancePubSub, startInstancePubSub } from './gcp';
import { GiphyFetch } from '@giphy/js-fetch-api';
import fetch from 'node-fetch';

function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level}: ${message}`);
}

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const gf = new GiphyFetch(process.env.GIPHY_TOKEN);
declare let global;
global.fetch = fetch;

async function getRandomGif(keyword: string) {
  const min = 0;
  const max = 15;
  const startGifsSearch: number = Math.floor(
    min + Math.random() * (max - min + 1)
  );
  const { data: gifs } = await gf.search(keyword, {
    sort: 'relevant',
    lang: 'es',
    limit: max,
    type: 'gifs',
    offset: startGifsSearch,
  });
  return gifs[Math.floor(Math.random() * gifs.length)];
}

bot.start(async (ctx: Context) => {
  await ctx.reply('Hola wuachinn machin');
});

bot.command('prender_servercito', async (ctx: Context) => {
  try {
    const event = {
      zone: process.env.SERVER_GCP_ZONE || 'us-central1-a',
      label: `name=${process.env.SERVER_GCP_NAME || 'minecraft-server'}`,
    };
    const data = {
      data: Buffer.from(JSON.stringify(event)).toString('base64'),
    };
    await ctx.reply('Prendiendo el servercito... 🙏');
    await startInstancePubSub(data, async () => {
      await ctx.reply('Prendiste el servercito 💚');
      const gamingGif = await getRandomGif('gaming');
      await ctx.replyWithAnimation(gamingGif.images.fixed_height);
    });
  } catch (error) {
    log(`Error in 'prender_servercito': ${error.message}`, 'ERROR');
    await ctx.reply('Oops! Something went wrong.');
  }
});

bot.command('apagar_servercito', async (ctx: Context) => {
  try {
    const event = {
      zone: process.env.SERVER_GCP_ZONE || 'us-central1-a',
      label: `name=${process.env.SERVER_GCP_NAME || 'minecraft-server'}`,
    };
    const data = {
      data: Buffer.from(JSON.stringify(event)).toString('base64'),
    };
    await ctx.reply('Apagando el servercito... 🤞');
    await stopInstancePubSub(data, async () => {
      await ctx.reply('Apagaste el servercito 😪');
      const sleepingGif = await getRandomGif('sleeping');
      await ctx.replyWithAnimation(sleepingGif.images.fixed_height);
    });
  } catch (error) {
    log(`Error in 'apagar_servercito': ${error.message}`, 'ERROR');
    await ctx.reply('Oops! Something went wrong.');
  }
});

bot.hears(
  /\bminecra|dragon|juegan|juga|game|meme.*\b/,
  async (ctx: Context) => {
    const responses = [
      'NO',
      'No',
      'TOY CHIQUITA 😪',
      'NI EMPEDO',
      'Obvio perro',
      'Si',
      'SI',
      '💚',
      '💔',
    ];
    const randResponse =
      responses[Math.floor(Math.random() * responses.length)];
    await ctx.reply(`${randResponse}`);
  }
);

const port = process.env.PORT || 3333;
const server = app.listen(port, async () => {
  log(`Server listening at http://localhost:${port}`);
  await bot.launch();
});
server.on('error', (error) => {
  log(`Server error: ${error.message}`, 'ERROR');
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise} reason: ${reason}`, 'ERROR');
});

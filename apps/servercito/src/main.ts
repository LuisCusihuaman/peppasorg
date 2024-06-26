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
global.fetch = fetch;

app.use(bot.webhookCallback('/bot' + process.env.BOT_TOKEN));

async function getRandomGif(keyword: string) {
  const min = 0;
  const max = 20;
  const startGifsSearch = Math.floor(min + Math.random() * (max - min + 1));
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
      name: `${process.env.SERVER_GCP_NAME || 'minecraft-server'}`,
    };
    const data = {
      data: Buffer.from(JSON.stringify(event)).toString('base64'),
    };
    await ctx.reply('Prendiendo el servercito... 🙏');
    await startInstancePubSub(data, async () => {
      await ctx.reply('Prendiste el servercito 💚');
      const gamingGif = await getRandomGif('game');
      await ctx.replyWithAnimation(gamingGif.images.fixed_height);
    });
  } catch (error) {
    log(`Error in 'prender_servercito': ${error}`, 'ERROR');
    await ctx.reply('Oops! Something went wrong.');
  }
});

bot.command('apagar_servercito', async (ctx: Context) => {
  try {
    const event = {
      zone: process.env.SERVER_GCP_ZONE || 'us-central1-a',
      name: `${process.env.SERVER_GCP_NAME || 'minecraft-server'}`,
    };
    const data = {
      data: Buffer.from(JSON.stringify(event)).toString('base64'),
    };
    await ctx.reply('Apagando el servercito... 🤞');
    await stopInstancePubSub(data, async () => {
      await ctx.reply('Apagaste el servercito 😪');
      const sleepingGif = await getRandomGif('tired');
      await ctx.replyWithAnimation(sleepingGif.images.fixed_height);
    });
  } catch (error) {
    log(`Error in 'apagar_servercito': ${error}`, 'ERROR');
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
    await ctx.reply(randResponse);
  }
);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Health check OK');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise} reason: ${reason}`, 'ERROR');
});

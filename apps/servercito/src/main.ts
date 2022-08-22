/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import {Telegraf, Context} from "telegraf";


const app = express();
const bot = new Telegraf("process.env.BOT_TOKEN");

bot.start((ctx: Context) => {
  ctx.reply("Hola wuachinn machin")
})


bot.start((ctx: Context) => {
  ctx.reply("Hola wuachinn machin")
})

bot.hears('minecraft', (ctx: Context) => {
  const responses = ["NO", "NO", "NI EMPEADO", "Obvio perro", "Si", "SI", "💚", "💔"];
  const randResponse = responses[Math.floor(Math.random() * responses.length)];
  ctx.reply(`${randResponse}`);
});

bot.command('prender_servercito', (ctx: Context) => {
  ctx.reply('Prendiste el servercito 💪!');
});


bot.command('apagar_servercito', (ctx: Context) => {
  ctx.reply('Apagaste el servercito 😪!');
});

bot.launch()
const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);

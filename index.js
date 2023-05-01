const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '5664892358:AAGKNiDgbv7FgPT8vJCoqo_B9WNVG-f7gz4';

const bot = new TelegramApi(token, { polling: true });
const chats = {};

bot.setMyCommands([
  { command: '/start', description: 'Приветствие' },
  { command: '/info', description: 'Получить информацию о пользователе' },
  { command: '/game', description: 'Игра угадай цифру' },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'now I will guess a number from 1-9, and you have to guess');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'guess', gameOptions);
};

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.eu/_/stickers/103/ec9/103ec963-babe-310e-a90e-951b969835a4/1.webp'
      );
      return bot.sendMessage(chatId, `Welcome my friend, this is bot, which name TestBot`);
    }

    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Your name ${msg.from.first_name} ${(msg.from.last_name = 'default name')}`
      );
    }

    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(
      chatId,
      'Sorry, but I dont understant your question, can you again, please'
    );
  });

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, `Congratulate, you won ${data}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `Unfortunately, but you lost`, againOptions);
    }
  });
};

start();

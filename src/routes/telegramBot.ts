const TelegramBot = require('node-telegram-bot-api');
const token = '';
export const bot = process.env.ACTIVATE_TELEGRAM_BOT === 'true'
    ? new TelegramBot(token, {polling: true})
    : null;

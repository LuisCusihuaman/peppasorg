# 🚀 PEPPASORG Project

The application is a Telegram bot that interacts with users and performs various tasks such as starting and stopping a server, and responding to certain keywords with predefined responses or GIFs from Giphy. 

The bot uses the `Telegraf` library for the Telegram API, `node-fetch` for making HTTP requests, and `GiphyFetch` from the `@giphy/js-fetch-api` library to fetch GIFs.

The bot commands include:

- `/prender_servercito`: Starts the server and replies with a gaming GIF.
- `/apagar_servercito`: Stops the server and replies with a sleeping GIF.

## 🔑 Obtaining API Tokens and Credentials

### 🤖 Telegram Bot Token

1. Open the Telegram app and search for the "BotFather" bot.
2. Start a chat with BotFather and send the command `/newbot`.
3. Follow the prompts to create a new bot and obtain your bot token.

### 🎞️ Giphy Token

1. Go to the [Giphy Developers Portal](https://developers.giphy.com/).
2. Create a new app and obtain your Giphy API key.

### ☁️ Google Cloud Platform Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "APIs & Services" > "Credentials".
4. Click "Create Credentials" and select "Service account".
5. Follow the prompts to create a new service account and download the JSON key file.

After obtaining these tokens and credentials, place the GCP JSON key file in the project root and update the `options` object in your code:

```javascript
const options = {
  keyFilename: './my_credentials.json', // Replace with your actual JSON key file name
};
```

### 🛠️ Setup and Installation

1. Clone the repository to your local machine.
2. Navigate to the project's root directory in your terminal.

#### 💻 Development

1. Run `pnpm install` to install the necessary dependencies.
2. Run `pnpm start` to start the development server.

## 🏃‍♂️ Running the Project

After installing the dependencies, you can start the development server by running `pnpm start` in the terminal. This will start the server and you can access the application at `http://localhost:8443`.

## 📚 Support and Documentation

For more information and troubleshooting, refer to the following resources:

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Giphy API Documentation](https://developers.giphy.com/docs/api/)
- [Google Cloud Platform Documentation](https://cloud.google.com/docs)

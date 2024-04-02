# 🚀 PEPPASORG

La aplicación es un bot de Telegram que interactúa con los usuarios y realiza varias tareas, como iniciar y detener un servidor, y responder a ciertas palabras clave con respuestas predefinidas o GIFs de Giphy.

El bot utiliza la biblioteca `Telegraf` para la API de Telegram, `node-fetch` para hacer solicitudes HTTP, y `GiphyFetch` de la biblioteca `@giphy/js-fetch-api` para buscar GIFs.

Los comandos del bot incluyen:

- `/prender_servercito`: Inicia el servidor y responde con un GIF de juego.
- `/apagar_servercito`: Detiene el servidor y responde con un GIF de sueño.

# 🔥 DEPLOYMENT

```shell
docker-compose up -d --build
```

## 🔑 Obtención de tokens de API y credenciales

### 🤖 Token del bot de Telegram

1. Abre la aplicación de Telegram y busca el bot "BotFather".
2. Inicia un chat con BotFather y envía el comando `/newbot`.
3. Sigue las indicaciones para crear un nuevo bot y obtener tu token de bot.

### 🎞️ Token de Giphy

1. Ve al [Portal de Desarrolladores de Giphy](https://developers.giphy.com/).
2. Crea una nueva aplicación y obtén tu clave de API de Giphy.

### ☁️ Credenciales de Google Cloud Platform

1. Ve a la [Consola de Google Cloud](https://console.cloud.google.com/).
2. Crea un nuevo proyecto o selecciona uno existente.
3. Navega a "APIs y servicios" > "Credenciales".
4. Haz clic en "Crear credenciales" y selecciona "Cuenta de servicio".
5. Sigue las indicaciones para crear una nueva cuenta de servicio y descarga el archivo de clave JSON.

Después de obtener estos tokens y credenciales, coloca el archivo de clave JSON de GCP en la raíz del proyecto, con el nombre:

```javascript
const options = {
  keyFilename: './my_credentials.json', // Reemplaza con el nombre de tu archivo de clave JSON real
};
```

#### 💻 Desarrollo

1. Ejecuta `pnpm install` para instalar las dependencias necesarias.
2. Ejecuta `pnpm start` para iniciar el servidor de desarrollo.

## 🏃‍♂️ Ejecución del Proyecto

Después de instalar las dependencias, puedes iniciar el servidor de desarrollo ejecutando `pnpm start` en la terminal. Esto iniciará el servidor y podrás acceder a la aplicación en `http://localhost:8443`.

## 📚 Soporte y Documentación

Para más información y solución de problemas, consulta los siguientes recursos:

- [Documentación de la API del Bot de Telegram](https://core.telegram.org/bots/api)
- [Documentación de la API de Giphy](https://developers.giphy.com/docs/api/)
- [Documentación de Google Cloud Platform](https://cloud.google.com/docs)

# 🚀 PEPPASORG

La aplicación es un bot de Telegram que interactúa con los usuarios y realiza varias tareas, como iniciar y detener un servidor, y responder a ciertas palabras clave con respuestas predefinidas o GIFs de Giphy.

El bot utiliza la biblioteca `Telegraf` para la API de Telegram, `node-fetch` para hacer solicitudes HTTP, y `GiphyFetch` de la biblioteca `@giphy/js-fetch-api` para buscar GIFs.

Los comandos del bot incluyen:

- `/prender_servercito`: Inicia el servidor y responde con un GIF de juego.
- `/apagar_servercito`: Detiene el servidor y responde con un GIF de sueño.

## 📦 Configuración del Servidor

### Obtener una IP Pública Estática en Google Cloud Platform

1. Reserva una dirección IP estática en GCP:
   ```bash
   gcloud compute addresses create minecraft-static-ip --region=us-central1
   ```

### Crear una Instancia de VM

1. Crea una instancia de VM en GCP con el siguiente comando:
   ```bash
   gcloud compute instances create minecraft-server \
       --zone=us-central1-a \
       --custom-cpu=4 \
       --custom-memory=12GB \
       --boot-disk-size=20GB \
       --image-family=debian-10 \
       --image-project=debian-cloud \
       --tags=minecraft-server \
       --address=minecraft-static-ip \
       --metadata=startup-script='#! /bin/bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   mkdir /home/minecraft
   chown debian:debian /home/minecraft'
   ```

### Configurar Reglas de Firewall

1. Agrega reglas de firewall para permitir el tráfico en los puertos necesarios:
   ```bash
   gcloud compute firewall-rules create allow-3333-25565 \
       --allow tcp:3333,tcp:25565 \
       --target-tags=minecraft-server \
       --description="Allow traffic on ports 3333 (Telegram BOT) and 25565 (MINECRAFT SERVER)"
   ```

### Configuración de permisos para la cuenta de servicio de Minecraft

1. **Crear la cuenta de servicio**:

   ```bash
   gcloud iam service-accounts create minecraft-server-account --display-name "Minecraft Server Account"
   ```

2. **Obtener tu ID de proyecto automáticamente**:

   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   echo $PROJECT_ID
   ```

3. **Crear un rol personalizado** con los permisos necesarios para iniciar y detener la instancia de Minecraft:

   ```bash
   gcloud iam roles create minecraft_instance_control --project $PROJECT_ID --title "Minecraft Instance Control" --description "Custom role for starting and stopping Minecraft instance" --permissions compute.instances.start,compute.instances.stop,compute.instances.list
   ```

4. **Asignar el rol personalizado a la cuenta de servicio**:

   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:minecraft-server-account@$PROJECT_ID.iam.gserviceaccount.com" --role=projects/$PROJECT_ID/roles/minecraft_instance_control
   ```

5. **Generar el archivo de clave JSON** para la cuenta de servicio:
   ```bash
   gcloud iam service-accounts keys create ./my_credentials.json --iam-account=minecraft-server-account@$PROJECT_ID.iam.gserviceaccount.com
   ```

# 🔥 DEPLOYMENT

1. **Clonar el repositorio en `/home/minecraft`**:
   Asegúrate de que el directorio `/home/minecraft` existe y tiene los permisos adecuados. Luego, clona tu repositorio en esa carpeta:

   ```shell
   cd /home/minecraft
   git clone <URL-del-repositorio> .
   ```

2. **Configurar las variables de entorno**:
   Las variables de entorno necesarias para la aplicación están definidas en el archivo `docker-compose.yml`. Asegúrate de que este archivo contenga las configuraciones correctas para tu aplicación, como el token del bot de Telegram y la clave API de Giphy.

   Ejemplo de sección de entorno en `docker-compose.yml`:

   ```yaml
   services:
     bot:
       environment:
         BOT_TOKEN: 'your-bot-token'
         GIPHY_TOKEN: 'your-giphy-token'
   ```

   Reemplaza `your-bot-token` y `your-giphy-token` con los valores correspondientes.

3. **Desplegar con Docker**:
   Asegúrate de que tienes un archivo `docker-compose.yml` en tu proyecto que define cómo se debe construir y ejecutar tu aplicación. Luego, en la carpeta de tu proyecto (que debería ser `/home/minecraft` si seguiste el primer paso), ejecuta:

   ```shell
   docker compose up mc -d --build
   ```

   Este comando construirá la imagen de tu aplicación y la ejecutará en modo detached, permitiendo que tu bot de Telegram se inicie y funcione en segundo plano.

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

# 🚀 PEPPASORG

La aplicación es un bot de Telegram que interactúa con los usuarios y realiza varias tareas, como iniciar y detener un servidor, y responder a ciertas palabras clave con respuestas predefinidas o GIFs de Giphy.

El bot utiliza la biblioteca `Telegraf` para la API de Telegram, `node-fetch` para hacer solicitudes HTTP, y `GiphyFetch` de la biblioteca `@giphy/js-fetch-api` para buscar GIFs.

Los comandos del bot incluyen:

- `/prender_servercito`: Inicia el servidor y responde con un GIF de juego.
- `/apagar_servercito`: Detiene el servidor y responde con un GIF de sueño.

![peppaorg](peppaorg.png)

## 📦 Configuración del Minecraft Server

👉 Se solicitara habilitar compute.googleapis.com para crear la maquina virtual donde correrá el servidor de Minecraft.

### Obtener una IP Pública Estática en Google Cloud Platform

1. Reserva una dirección IP estática en GCP:
   ```bash
   gcloud compute addresses create minecraft-static-ip --region=us-central1
   ```

### 🐷 Despliegue de la VM Minecraft Server

1. Crea una instancia de VM en GCP con el siguiente comando:
   ```bash
   SERVER_GCP_ZONE=us-central1-a
   SERVER_GCP_NAME=minecraft-server
   SERVER_GCP_MACHINE_TYPE=e2-standard-4
   USERNAME=$(whoami)
   gcloud compute instances create $SERVER_GCP_NAME \
    --zone=$SERVER_GCP_ZONE \
    --machine-type=$SERVER_GCP_MACHINE_TYPE \
    --boot-disk-size=20GB \
    --image-family=debian-10 \
    --image-project=debian-cloud \
    --tags=$SERVER_GCP_NAME \
    --address=minecraft-static-ip \
    --metadata username=$USERNAME,startup-script='#!/bin/sh
   USERNAME=$(curl -s "http://metadata.google.internal/computeMetadata/v1/instance/attributes/username" -H "Metadata-Flavor: Google")
   mkdir -p /home/minecraft && git clone https://github.com/LuisCusihuaman/peppasorg.git /home/minecraft && chown -R $USERNAME:$USERNAME /home/minecraft
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && usermod -aG docker $USERNAME
   cd /home/$USERNAME/
   sudo -u $USERNAME docker compose up -d'
   ```

💸 PRICING: [$104.82/ mo](https://cloud.google.com/products/calculator/estimate-preview/5c08ef3e-87c1-4310-9f08-5cc4c3870264?hl=es_419)

### Configurar Reglas de Firewall

1. Agrega reglas de firewall para permitir el tráfico en los puertos necesarios:
   ```bash
   gcloud compute firewall-rules create allow-25565-8080 \
       --allow tcp:25565,tcp:8080 \
       --target-tags=$SERVER_GCP_NAME \
       --description="Allow traffic on port 25565 (MINECRAFT SERVER) and 8080 (FILE SERVER)"
   ```

## 🤖 Despliegue del Telegram Bot (OPCIONAL)

👉 Se solicitara habilitar cloudbuild.googleapis.com y run.googleapis.com (TOMARA UN TIEMPO) para la construcción y despliegue del bot.

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
   gcloud iam roles create minecraft_instance_control --project $PROJECT_ID --title "Minecraft Instance Control" --description "Custom role for starting and stopping Minecraft instance" --permissions compute.instances.start,compute.instances.stop,compute.instances.list,compute.zoneOperations.get,compute.zoneOperations.list
   ```

4. **Asignar el rol personalizado a la cuenta de servicio**:

   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:minecraft-server-account@$PROJECT_ID.iam.gserviceaccount.com" --role=projects/$PROJECT_ID/roles/minecraft_instance_control
   ```

5. **Generar el archivo de clave JSON** para la cuenta de servicio:

   ```bash
   gcloud iam service-accounts keys create ./my_credentials.json --iam-account=minecraft-server-account@$PROJECT_ID.iam.gserviceaccount.com
   ```

### Despliegue del Bot en Google Cloud Run

1. **Clonar el repositorio del bot**:
   Primero, clona el repositorio del bot de Telegram a tu entorno local o de desarrollo:

   ```shell
   git clone https://github.com/LuisCusihuaman/peppasorg.git peppasorg-bot
   ```

2. **Copiar el archivo de credenciales**:
   Copia `my_credentials.json` al directorio del proyecto clonado:

   ```shell
   cp my_credentials.json peppasorg-bot/
   ```

3. **Construye la imagen del contenedor y súbela a Container Registry**:
   Desde el directorio del proyecto, construye y sube la imagen directamente a Google Container Registry:

   ```shell
   PROJECT_ID=$(gcloud config get-value project)
   gcloud builds submit --tag gcr.io/$PROJECT_ID/peppasorg-bot peppasorg-bot/
   ```

4. **Despliega en Cloud Run**:
   Utiliza el siguiente comando para desplegar tu bot:

   ```shell
   SERVER_GCP_REGION=us-central1
   SERVER_GCP_ZONE=us-central1-a
   SERVER_GCP_NAME=minecraft-server
   GIPHY_TOKEN=your-giphy-token
   BOT_TOKEN=your-bot-token
   gcloud run deploy peppasorg-bot \
   --image gcr.io/$PROJECT_ID/peppasorg-bot \
   --platform managed \
   --region $SERVER_GCP_REGION \
   --allow-unauthenticated \
   --set-env-vars PRODUCTION='true',\
   SERVER_GCP_NAME=$SERVER_GCP_NAME,\
   SERVER_GCP_ZONE=$SERVER_GCP_ZONE,\
   GIPHY_TOKEN=$GIPHY_TOKEN,\
   BOT_TOKEN=$BOT_TOKEN
   ```

5. **Configura el webhook de Telegram**:
   Configura el webhook de Telegram para que el bot pueda recibir actualizaciones de mensajes:

   ```shell
   CLOUD_RUN_URL=$(gcloud run services describe peppasorg-bot --region $SERVER_GCP_REGION --format 'value(status.url)')
   curl -F "url=${CLOUD_RUN_URL}/bot${BOT_TOKEN}" https://api.telegram.org/bot${BOT_TOKEN}/setWebhook
   ```

   Reemplaza `your-bot-token` con el token de tu bot de Telegram, `your-giphy-token` con tu token de API de Giphy.

Este proceso clonará el repositorio del bot, copiará el archivo de credenciales necesario en el directorio del proyecto, construirá la imagen del contenedor y la desplegará en Google Cloud Run.

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
  keyFilename: './my_credentials.json',
};
```

## 💻 Desarrollo

1. Exporta las variables de entorno necesarias en tu terminal:

   ```bash
   export SERVER_GCP_NAME=minecraft-server
   export SERVER_GCP_ZONE=us-central1-a
   export BOT_TOKEN=your-bot-token
   export GIPHY_TOKEN=your-giphy-token
   ```

2. Copia el archivo de credenciales `my_credentials.json` de GCP en el directorio del proyecto.
3. Ejecuta `pnpm install` para instalar las dependencias necesarias.
4. Ejecuta `pnpm start` para iniciar el servidor de desarrollo.

## 📚 Soporte y Documentación

Para más información y solución de problemas, consulta los siguientes recursos:

- [Documentación de la API del Bot de Telegram](https://core.telegram.org/bots/api)
- [Documentación de la API de Giphy](https://developers.giphy.com/docs/api/)
- [Documentación de Google Cloud Platform](https://cloud.google.com/docs)
- [Documentación de Minecraft Server](https://docker-minecraft-server.readthedocs.io/en/latest/variables/)

## 🤝 Contribuidores

Este proyecto ha sido posible gracias a la colaboración de los siguientes contribuidores:

- ![Luis Cusihuaman](https://github.com/LuisCusihuaman.png?size=50) [Luis Cusihuaman](https://github.com/LuisCusihuaman)
- ![Eddy Vega](https://github.com/EddyVegaGarcia.png?size=50) [Eddy Vega](https://github.com/EddyVegaGarcia)

¡Agradecemos su dedicación y esfuerzo en llevar adelante este proyecto!

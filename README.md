# SIGMA

SIGMA es una aplicación que estamos construyendo para dar seguimiento a la operación y mostrar su información en un solo lugar.

El proyecto sigue en desarrollo. Por ahora incluye una pantalla de monitoreo y acceso para usuarios autorizados.

## Para ejecutarlo

Necesitas Node.js y Docker Desktop.

1. Instala las dependencias y prepara tu configuración local:

   ```bash
   npm install
   cp .env.example .env
   ```

2. Completa los datos de `.env` con tus valores locales.

3. Inicia la base de datos y prepara el primer usuario:

   ```bash
   docker compose up -d postgres
   npm run db:migrate
   npm run db:create-admin
   ```

4. Abre dos terminales y ejecuta:

   ```bash
   npm run dev
   ```

   ```bash
   npm run api:dev
   ```

La aplicación estará disponible en `http://localhost:5173`.

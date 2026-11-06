# SIGMA

Aplicación con React, TypeScript y Vite, y API de autenticación con Express y PostgreSQL.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm
- Docker con Docker Compose (para PostgreSQL local), o una instancia PostgreSQL

## Preparación local

1. Instala dependencias y crea la configuración local:

   ```bash
   npm install
   cp .env.example .env
   ```

2. En `.env`, cambia `POSTGRES_PASSWORD` por una contraseña local y actualiza
   `DATABASE_URL` con la misma contraseña. Define `SIGMA_ADMIN_EMAIL`,
   `SIGMA_ADMIN_NAME` y una `SIGMA_ADMIN_PASSWORD` propia de al menos 12
   caracteres (máximo 72 bytes). No compartas ni subas `.env`.

3. Inicia PostgreSQL y crea las tablas de autenticación:

   ```bash
   docker compose up -d postgres
   npm run db:migrate
   npm run db:create-admin
   ```

4. En dos terminales, inicia la interfaz y la API:

   ```bash
   npm run dev
   npm run api:dev
   ```

   La interfaz estará en `http://localhost:5173` y la API en
   `http://localhost:3001`. Vite reenvía `/api` a la API durante el desarrollo.

## API de autenticación

Todas las respuestas usan JSON salvo el cierre de sesión exitoso (`204`).
La sesión se transporta en una cookie `HttpOnly`, `SameSite=Lax`; en producción
también se marca `Secure`. La API no ofrece registro público.

| Método | Ruta | Respuesta |
| --- | --- | --- |
| `GET` | `/api/health` | Comprueba que la API puede consultar PostgreSQL |
| `POST` | `/api/auth/login` | Acepta `{ "email": "...", "password": "..." }` y establece la cookie de sesión |
| `GET` | `/api/auth/me` | Devuelve el usuario de la sesión actual |
| `POST` | `/api/auth/logout` | Revoca la sesión y elimina la cookie |

Las contraseñas se almacenan con bcrypt. La base de datos conserva solamente
el hash SHA-256 del token de sesión, no el token de la cookie. Los intentos de
login tienen un límite básico por proceso; para múltiples instancias, este
límite deberá trasladarse a un almacén compartido.

## Validación

```bash
npm run build
npm run api:build
npm run lint
```

## Estructura

```text
src/
  app/          Composición de la interfaz
  components/   Componentes compartidos
  features/     Funcionalidades agrupadas por dominio
  hooks/        Hooks reutilizables
  layouts/      Estructuras visuales compartidas
  pages/        Vistas asociadas a rutas
  services/     Integraciones y acceso a APIs
  styles/       Estilos globales
  types/        Tipos compartidos
  utils/        Funciones auxiliares
server/
  migrations/   Esquema PostgreSQL
  src/auth/     Rutas y sesiones
  src/db/       Conexión y migraciones
  src/scripts/  Bootstrap del primer administrador
```

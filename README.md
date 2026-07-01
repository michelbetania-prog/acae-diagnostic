# Sazón Local RD MVP

Plataforma web para comercios gastronómicos pequeños en República Dominicana. No maneja riders ni delivery propio: cada comercio recibe pedidos por WhatsApp y coordina entrega o retiro.

## Estructura del proyecto

- `app/`: rutas Next.js App Router.
  - `app/page.tsx`: marketplace público con filtros.
  - `app/tienda/[slug]/page.tsx`: página pública del comercio.
  - `app/dashboard/*`: panel base del comercio.
  - `app/admin/page.tsx`: panel administrador base.
  - `app/login` y `app/register`: pantallas de autenticación.
- `components/`: navegación y componentes de tienda.
- `lib/supabase/`: clientes Supabase server/browser.
- `lib/data/`: queries y datos demo para correr sin credenciales.
- `supabase/schema.sql`: tablas, relaciones y políticas RLS.

## Esquema Supabase SQL

Ejecuta `supabase/schema.sql` en el SQL editor de Supabase. Incluye:

- `profiles`: usuario, rol `admin`/`comercio` y comercio asociado.
- `businesses`: perfil público, WhatsApp, zona, horarios y estado.
- `categories`: categorías globales o por comercio.
- `products`: catálogo del comercio.
- `orders`: registro opcional del pedido enviado por WhatsApp.
- RLS: propietarios editan solo sus datos/productos; admin puede todo; público ve comercios/productos activos.

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=only-for-server-admin-tasks
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Correr localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Si no configuras Supabase, la app usa datos demo para el marketplace y tiendas.

## Funcionalidades incluidas en el código base

- Marketplace con filtros por zona, categoría y comercios abiertos.
- URL pública `/tienda/nombre-del-comercio`.
- Cards de productos responsive.
- Carrito simple en cliente.
- Botón “Pedir por WhatsApp” con comercio, productos, cantidades, total, cliente, dirección/retiro y nota.
- Pantallas base para registro, login, panel comercio, gestión de productos y admin.
- SQL Supabase completo con RLS seguro para el MVP.

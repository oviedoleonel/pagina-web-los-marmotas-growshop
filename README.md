# Los Marmotas Growshop — Catálogo Web

Catálogo online estático (hosteado en GitHub Pages) con datos dinámicos provenientes de **JSONBin** y assets en **Cloudinary**. Permite explorar productos por categoría, marca y búsqueda, y generar pedidos por WhatsApp.

> **Demo pública:** [https://oviedoleonel.github.io/pagina-web-los-marmotas-growshop/](https://oviedoleonel.github.io/pagina-web-los-marmotas-growshop/)

---

## Índice

* [Características](#características)
* [Stack](#stack)
* [Arquitectura y Flujo de Datos](#arquitectura-y-flujo-de-datos)
* [Estructura del Proyecto](#estructura-del-proyecto)
* [Variables y Configuración](#variables-y-configuración)

  * [JSONBin](#jsonbin)
  * [Cloudinary](#cloudinary)
  * [WhatsApp](#whatsapp)
* [Esquema de Datos (JSON)](#esquema-de-datos-json)

  * [Ejemplo de Producto](#ejemplo-de-producto)
  * [Listado de Categorías / Marcas](#listado-de-categorías--marcas)
* [Actualización del Catálogo](#actualización-del-catálogo)
* [Desarrollo Local](#desarrollo-local)
* [Despliegue en GitHub Pages](#despliegue-en-github-pages)
* [Rendimiento y SEO](#rendimiento-y-seo)
* [Solución de Problemas](#solución-de-problemas)
* [Roadmap / TODO](#roadmap--todo)
* [Licencia](#licencia)

---

## Características

* UI responsive con **Tailwind CSS**.
* Navegación por **categorías**, **marcas**, **subcategorías** (si aplica) y **búsqueda**.
* **Filtro** de marcas dinámico según la categoría seleccionada.
* **Actualización de productos en tiempo real** desde **JSONBin** (sin necesidad de re-deploy del sitio).
* **Imágenes** servidas desde **Cloudinary** con soporte para **transformaciones** (optimización, formato auto, calidad auto).
* **Botón de compra por WhatsApp** que arma el mensaje con el detalle del producto y URL.
* Modo de "**administración ligera**" (en cliente) para facilitar carga/edición básica de productos (opcional/si está habilitado en el código).

## Stack

* **Frontend:** HTML + CSS (Tailwind) + JavaScript vanilla.
* **Hosting:** GitHub Pages.
* **Datos:** JSONBin (lectura y, opcionalmente, escritura vía API).
* **Media:** Cloudinary (URLs públicas y/o public IDs con transformaciones).

## Arquitectura y Flujo de Datos

1. La app se sirve como sitio estático desde GitHub Pages.
2. Al cargar la página, un script **fetch** consulta el **endpoint público/lectura** de JSONBin para obtener `products.json` (y, si aplica, `categories.json`, `brands.json`).
3. Con esos datos se puebla la UI: grilla de productos, filtros de marca por categoría, etc.
4. Las imágenes se cargan desde **Cloudinary** usando URLs optimizadas (`f_auto,q_auto`), o se construyen a partir de **public\_id** + transformaciones.
5. La acción "Comprar" abre **WhatsApp** con un mensaje preformateado (nombre del producto, precio, link, y/o SKU).

> ⚠️ **Seguridad**: al ser un sitio estático, evita exponer claves privadas. Para JSONBin utiliza endpoints de **lectura pública** o un **proxy** si necesitas operaciones seguras de escritura.

## Estructura del Proyecto

> *La estructura exacta puede variar; ajusta esta sección a tu repo.*

```
root/
├─ index.html
├─ /assets
│  ├─ /img (solo íconos locales si hiciera falta)
│  └─ /css
├─ /js
│  ├─ app.js                 # lógica principal (fetch de JSONBin, render)
│  ├─ filters.js             # búsqueda, filtros, orden, paginación
│  ├─ ui.js                  # templates HTML y utilidades de DOM
│  └─ config.js              # IDs/URLs de JSONBin, Cloudinary cloud name, etc.
└─ /data (opcional si haces mock local)
   └─ products.sample.json
```

## Variables y Configuración

Centraliza la configuración en `js/config.js` (o equivalente):

```js
// JSONBin
export const JSONBIN_BASE     = "https://api.jsonbin.io/v3/b/"; // o collection endpoint
export const JSONBIN_BIN_ID   = "<TU_BIN_ID>"; // products.json
export const JSONBIN_READ_KEY = ""; // opcional si el bin no es público (no recomendado en cliente)

// Cloudinary
export const CLOUD_NAME = "<tu_cloud_name>"; // ej: losmarmotas
export const CLOUD_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
export const CLOUD_TRANSFORM = "f_auto,q_auto"; // agrega w_600,c_fill si quieres thumbnails

// WhatsApp
export const WHATSAPP_NUMBER = "54911XXXXYYYY"; // solo dígitos con país/área
```

### JSONBin

* **Bin ID**: identifica tu JSON de productos.
* **Acceso:** si el bin es público de lectura, puedes omitir la clave de lectura. Para **escritura**, usa un backend/proxy (recomendado) para no exponer la **Master Key**.
* **Ratelimits:** JSONBin tiene límites de peticiones; considera cachear en `localStorage` y hacer revalidación.

### Cloudinary

* Usa **URLs con transformaciones** para optimizar: `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_600/<public_id>.webp`.
* Puedes almacenar sólo el **public\_id** en el JSON y construir la URL en el cliente.

### WhatsApp

* Formato de link: `https://wa.me/<WHATSAPP_NUMBER>?text=<mensaje-encodeado>`.
* El mensaje suele incluir **nombre**, **precio**, **SKU**, y **URL del producto**.

## Esquema de Datos (JSON)

> Este esquema es una guía práctica; ajusta los campos a tu necesidad real.

```json
{
  "id": "uuid-o-sku",
  "name": "Nombre del producto",
  "category": "Indoor",
  "subcategory": "Iluminación",
  "brand": "MarcaX",
  "price": 29999.9,
  "currency": "ARS",
  "stock": 12,
  "unit": "unidad",
  "discount": 0,
  "tags": ["led", "full-spectrum"],
  "description": "Descripción breve en texto plano.",
  "images": [
    {
      "public_id": "losmarmotas/products/led_full_spectrum_600w",
      "alt": "Panel LED 600W"
    }
  ],
  "whatsapp_sku": "LED-600-FS",
  "featured": false,
  "variants": [
    { "label": "300W", "price": 17999.9, "stock": 5 },
    { "label": "600W", "price": 29999.9, "stock": 12 }
  ],
  "createdAt": "2025-08-20T12:00:00Z",
  "updatedAt": "2025-09-01T10:30:00Z"
}
```

### Listado de Categorías / Marcas

Puedes mantener bins separados, o campos agregados dentro del mismo bin de productos. Ejemplo simple:

```json
{
  "categories": ["Indoor", "Sustratos", "Fertilizantes", "Accesorios"],
  "brands": ["MarcaX", "MarcaY", "MarcaZ"]
}
```

## Actualización del Catálogo

1. **Sube la imagen a Cloudinary** → guarda el `public_id`.
2. **Edita el JSON en JSONBin** agregando/actualizando el producto.
3. **Guarda la versión** en JSONBin (puedes usar versiones para histórico).
4. **Verifica el sitio**: al recargar, la UI debería reflejar cambios. Si usas caché en `localStorage`, agrega un **parámetro de versión** o **timestamp** a la petición para forzar revalidación.

> Si usas un modo admin en el navegador, documenta las rutas/atajos para cargar/editar y cómo se autentica (ej.: un token de lectura-escritura guardado en sessionStorage — recuerda que **no es seguro** para producción).

## Desarrollo Local

1. Clona el repo.
2. Instala dependencias si las hubiera (p.ej. Tailwind CLI para build; si usas CDN, no hace falta).
3. Sirve el sitio con un servidor estático (por ejemplo):

   ```bash
   npx http-server . -p 5173
   # o
   python -m http.server 5173
   ```
4. Crea un archivo `js/config.local.js` (gitignored) para pruebas, y en `index.html` carga `config.local.js` sólo en local.

## Despliegue en GitHub Pages

1. Habilita **Pages** en `Settings → Pages` (branch `main`, carpeta root o `/docs`).
2. Asegúrate de que **todas las rutas** sean relativas o que el sitio esté preparado para el `base` de Pages.
3. Cada push al branch configurado actualiza automáticamente la demo.

## Rendimiento y SEO

* **Cloudinary** con `f_auto,q_auto,w_...` para thumbnails.
* **Lazy-load** de imágenes (`loading="lazy"`).
* Cache ligero con `localStorage` + `ETag`/`If-None-Match` si JSONBin lo soporta.
* Metadatos básicos en `<head>` (título, descripción, OG tags) y **favicon**.
* Sitemap (opcional) y `robots.txt`.

## Solución de Problemas

* **No carga el catálogo**: revisa el **Bin ID** y si el endpoint es **público**. Chequea la consola del navegador.
* **Imágenes no se ven**: valida el **public\_id** y el **cloud name**. Prueba la URL directa en el navegador con `f_auto,q_auto`.
* **WhatsApp no abre**: comprueba el **formato internacional** del número y el `encodeURIComponent` del mensaje.
* **Límites de JSONBin**: implementa cache, backoff exponencial, o monta un pequeño proxy.

## Roadmap / TODO

* Paginación y orden por precio/novedades.
* Vista de detalle por producto con URL única.
* Carrito liviano (localStorage) que agrupe items antes de enviar a WhatsApp.
* Panel admin seguro detrás de un backend simple (Cloudflare Workers / Vercel + KV/Firestore).
* Tests de UI básicos y verificación de esquema (JSON Schema).

## Licencia

Elige una licencia (por ejemplo **MIT**). Si no se define, todo derecho reservado.

---

### Créditos

* **Autor:** Los Marmotas Growshop (@oviedoleonel)
* **Imágenes:** Cloudinary
* **Datos:** JSONBin

---

> ¿Necesitas que adapte este README al árbol exacto de tu repositorio, o que incluya el esquema real de tus bins de JSONBin (con nombres de campos 1:1)? Puedo ajustarlo en segundos si me compartes el bin público o el `config.js` actual.

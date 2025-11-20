# 🚀 Guía de Despliegue en Railway
## Dark Souls Wiki - Deployment con SSL Automático

---

## 📋 REQUISITOS PREVIOS

- ✅ Cuenta en GitHub (ya tienes)
- ✅ Repositorio subido (ya está en: https://github.com/Juan789v-F/juan_orlando_irisUnidad4.git)
- ✅ Cuenta en Railway (crear gratis)

---

## 🎯 PASO 1: CREAR CUENTA EN RAILWAY

1. Ve a: **https://railway.app/**
2. Click en **"Start a New Project"** o **"Login"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway para acceder a tus repositorios
5. ¡Listo! Ya tienes cuenta

---

## 🗄️ PASO 2: CREAR BASE DE DATOS POSTGRESQL

1. En el dashboard de Railway, click en **"+ New"**
2. Selecciona **"Database"**
3. Selecciona **"Add PostgreSQL"**
4. Railway creará automáticamente la base de datos
5. Espera unos segundos hasta que aparezca **"Active"**

### Configurar la Base de Datos:

1. Click en el servicio **PostgreSQL**
2. Ve a la pestaña **"Data"**
3. Click en **"Query"**
4. Copia y pega el contenido de `backend/init.sql`
5. Click en **"Run Query"**
6. ✅ La base de datos está lista con los 4 jefes

---

## 🔧 PASO 3: DESPLEGAR EL BACKEND

1. En el dashboard, click en **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Busca y selecciona: **juan_orlando_irisUnidad4**
4. Railway detectará automáticamente el proyecto

### Configurar el Backend:

1. Railway te preguntará qué servicio desplegar
2. Selecciona la carpeta **"backend"**
3. Click en **"Add variables"**
4. Agrega estas variables de entorno:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tu-secreto-super-seguro-minimo-32-caracteres-aqui
YOUTUBE_API_KEY=tu-youtube-api-key-opcional
CORS_ORIGIN=*
PORT=3000
```

**Nota:** `${{Postgres.DATABASE_URL}}` se auto-completa con la URL de tu base de datos

5. Click en **"Deploy"**
6. Espera 2-3 minutos mientras se construye y despliega
7. ✅ Verás **"Success"** cuando esté listo

### Obtener la URL del Backend:

1. Click en el servicio **backend**
2. Ve a **"Settings"**
3. En **"Domains"**, click en **"Generate Domain"**
4. Railway te dará una URL como: `https://tu-backend.up.railway.app`
5. **Copia esta URL**, la necesitarás para el frontend

---

## 🎨 PASO 4: DESPLEGAR EL FRONTEND

1. En el dashboard, click en **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona de nuevo: **juan_orlando_irisUnidad4**
4. Esta vez selecciona la carpeta **"frontend"**

### Configurar el Frontend:

1. Click en **"Add variables"**
2. Agrega esta variable:

```
VITE_API_URL=https://tu-backend.up.railway.app
```

**⚠️ IMPORTANTE:** Reemplaza `tu-backend.up.railway.app` con la URL real de tu backend del paso anterior

3. Click en **"Deploy"**
4. Espera 2-3 minutos
5. ✅ Verás **"Success"** cuando esté listo

### Obtener la URL del Frontend:

1. Click en el servicio **frontend**
2. Ve a **"Settings"**
3. En **"Domains"**, click en **"Generate Domain"**
4. Railway te dará una URL como: `https://tu-frontend.up.railway.app`
5. **¡Esta es tu aplicación pública!** 🎉

---

## 🔒 PASO 5: CONFIGURAR CORS EN EL BACKEND

Ahora que tienes la URL del frontend, actualiza el CORS:

1. Ve al servicio **backend** en Railway
2. Click en **"Variables"**
3. Edita `CORS_ORIGIN` y cambia `*` por tu URL del frontend:

```
CORS_ORIGIN=https://tu-frontend.up.railway.app
```

4. Click en **"Save"**
5. El backend se redesplegará automáticamente

---

## ✅ PASO 6: VERIFICAR QUE TODO FUNCIONA

### Probar el Backend:

Abre en tu navegador:
```
https://tu-backend.up.railway.app/api/bosses
```

Deberías ver el JSON con los 4 jefes.

### Probar el Frontend:

Abre en tu navegador:
```
https://tu-frontend.up.railway.app
```

Deberías ver la aplicación funcionando con:
- ✅ Lista de jefes
- ✅ Imágenes cargadas
- ✅ Registro/Login funcionando
- ✅ Comentarios funcionando
- ✅ SSL/HTTPS automático (candado verde en el navegador)

---

## 🎯 RESUMEN DE URLs

Después del despliegue tendrás:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | `https://tu-frontend.up.railway.app` | Aplicación web pública |
| Backend API | `https://tu-backend.up.railway.app/api` | API REST |
| Base de Datos | `postgresql://...` | PostgreSQL (privada) |

---

## 📊 CARACTERÍSTICAS INCLUIDAS

✅ **Servidor de Aplicaciones:**
- Node.js/Express en Railway
- Auto-scaling
- Health checks automáticos

✅ **Servidor de Base de Datos:**
- PostgreSQL 15
- Backups automáticos
- Conexión segura

✅ **Certificado SSL:**
- HTTPS automático
- Certificado válido de Let's Encrypt
- Renovación automática

✅ **Dominio:**
- Subdominio gratuito de Railway
- Opción de dominio personalizado

✅ **Balanceo de Cargas:**
- Railway maneja automáticamente el balanceo
- Múltiples instancias si es necesario
- Failover automático

---

## 🔧 CONFIGURACIÓN AVANZADA (OPCIONAL)

### Agregar Dominio Personalizado:

1. Ve al servicio **frontend** en Railway
2. Click en **"Settings"** → **"Domains"**
3. Click en **"Custom Domain"**
4. Ingresa tu dominio (ej: `darksouls-wiki.com`)
5. Railway te dará un registro CNAME
6. Agrega el CNAME en tu proveedor de dominio
7. Espera 5-10 minutos para propagación DNS
8. ✅ Tu app estará en tu dominio personalizado con SSL

### Escalar el Backend:

1. Ve al servicio **backend**
2. Click en **"Settings"** → **"Deploy"**
3. Ajusta **"Replicas"** a 2 o más
4. Railway automáticamente balanceará la carga

### Ver Logs:

1. Click en cualquier servicio
2. Ve a la pestaña **"Deployments"**
3. Click en el deployment activo
4. Ve a **"View Logs"**
5. Verás logs en tiempo real

### Monitoreo:

1. Click en cualquier servicio
2. Ve a **"Metrics"**
3. Verás:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

---

## 💰 COSTOS

Railway ofrece:
- **$5 USD gratis al mes** (suficiente para desarrollo)
- Después: **$0.000231 por GB-hora** de RAM
- **$0.000463 por vCPU-hora**

Para este proyecto (uso moderado):
- Costo estimado: **$3-5 USD/mes**
- Incluye: Backend + Frontend + Base de Datos + SSL

---

## 🐛 TROUBLESHOOTING

### Error: "Application failed to respond"

**Solución:**
1. Verifica que el `PORT` esté configurado correctamente
2. Asegúrate de que el backend escuche en `0.0.0.0`
3. Revisa los logs para ver errores

### Error: "Database connection failed"

**Solución:**
1. Verifica que `DATABASE_URL` esté configurada
2. Asegúrate de que la base de datos esté **Active**
3. Verifica que el init.sql se haya ejecutado

### Error: "CORS policy"

**Solución:**
1. Actualiza `CORS_ORIGIN` con la URL correcta del frontend
2. Asegúrate de incluir `https://` en la URL
3. Redespliega el backend

### Frontend no carga datos:

**Solución:**
1. Verifica que `VITE_API_URL` apunte al backend correcto
2. Abre la consola del navegador (F12) para ver errores
3. Verifica que el backend esté respondiendo

---

## 📸 CAPTURAS PARA DOCUMENTACIÓN

### Captura 1: Dashboard de Railway
- Mostrar los 3 servicios: PostgreSQL, Backend, Frontend
- Estado "Active" en todos

### Captura 2: Variables de Entorno
- Mostrar las variables configuradas (difuminar secretos)

### Captura 3: Dominio con SSL
- Navegador mostrando la URL con candado verde (HTTPS)
- Aplicación funcionando

### Captura 4: Certificado SSL
- Click en el candado → Ver certificado
- Mostrar que es válido y emitido por Let's Encrypt

### Captura 5: Logs del Backend
- Mostrar logs de peticiones funcionando

### Captura 6: Métricas
- Gráficas de CPU, RAM, Network

---

## 🎉 ¡LISTO!

Tu aplicación ahora está:
- ✅ Desplegada en la nube
- ✅ Con HTTPS/SSL automático
- ✅ Con base de datos PostgreSQL
- ✅ Con dominio público
- ✅ Con balanceo de cargas automático
- ✅ Con monitoreo incluido

**URLs de tu proyecto:**
- Frontend: `https://tu-frontend.up.railway.app`
- Backend: `https://tu-backend.up.railway.app`

---

## 📞 SOPORTE

Si tienes problemas:
1. Revisa los logs en Railway
2. Consulta la documentación: https://docs.railway.app/
3. Comunidad de Railway: https://discord.gg/railway

---

**Fecha:** Noviembre 2024  
**Proyecto:** Dark Souls Wiki  
**Plataforma:** Railway  
**Repositorio:** https://github.com/Juan789v-F/juan_orlando_irisUnidad4.git

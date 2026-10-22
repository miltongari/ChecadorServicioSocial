# Checador Web de Servicio Social - TecNM Campus Pochutla (PWA + TypeScript + SQLite)

Sistema web institucional desarrollado para el **Instituto Tecnológico de Pochutla (Tecnológico Nacional de México)** para el control de asistencia y acreditación de horas de servicio social constitucional mediante escaneo de código QR. Optimizado para operar como Progressive Web App (PWA) en modo kiosko, tablets de acceso o dispositivos móviles.

---

## 🏛️ Identidad Institucional Oficial
- **Institución:** Tecnológico Nacional de México (TecNM).
- **Plantel:** Instituto Tecnológico de Pochutla.
- **Área Responsable:** Departamento de Gestión Tecnológica y Vinculación · Oficina de Servicio Social.
- **Paleta Oficial:** Azul TecNM (`#1B396A`), Azul Marino Profundo (`#0E1E38`), Dorado Institucional (`#B8860B`) y Guinda SEP (`#691C32`).
- **Nomenclatura:** Formato oficial de 8 dígitos para Número de Control (ej. `22730015`).

---

## 🔒 Autenticación Opcional (Candado de Seguridad)
El panel administrativo cuenta con un módulo de seguridad configurable que puede activarse o desactivarse en cualquier momento:
- **Estado actual por defecto:** **Desactivado** (acceso libre sin contraseña para facilitar pruebas y desarrollo ágil).
- **Para activarlo en el futuro:**
  1. Define en tu entorno o en `.env`:
     ```env
     ADMIN_AUTH_ENABLED=true
     ADMIN_PASSWORD=TuClaveSegura2026
     ```
  2. Al reiniciar, el sistema activará automáticamente el modal de login en el panel de administración (`/admin.html`) y exigirá la contraseña para acceder a la gestión de alumnos.

---

## 🚀 Características Principales

- **Escaneo Inteligente de QR:**
  - Si el alumno no tiene turno abierto: Registra **Entrada**.
  - Si el alumno tiene turno activo: Registra **Salida**, computa el tiempo neto y acumula sus horas.
- **Protección Anti-Rebote (Debounce):** Evita registros dobles por relectura rápida (< 30s).
- **Base de Datos Ultrarrápida:** SQLite en modo WAL (`better-sqlite3` + `drizzle-orm`) con índice compuesto `(estudiante_id, hora_salida)` para respuesta instantánea $O(1)$.
- **Gafetes Oficiales Imprimibles:** Generador automático de credenciales con código QR personalizadas con el membrete oficial del TecNM Pochutla (`/credenciales.html`).

---

## 🛠️ Stack Tecnológico

- **Lenguaje:** TypeScript 5.7+ (Modo estricto `noImplicitAny`, `strictNullChecks`).
- **Servidor Web:** Node.js 20+ con Express y CORS.
- **Base de Datos:** SQLite gestionado con `better-sqlite3` y tipado estricto con `drizzle-orm`.
- **Lector de Código:** `html5-qrcode`.
- **PWA:** Service Worker y Web App Manifest v2.

---

## 📂 Estructura del Proyecto

```
ChecadorServicioSocial/
├── src/
│   ├── index.ts                     # Punto de entrada del servidor Express
│   ├── db/
│   │   ├── index.ts                 # Conexión SQLite con pragmas WAL y llaves foráneas
│   │   ├── schema.ts                # Tablas (estudiantes, turnos) e índices Drizzle
│   │   └── seed.ts                  # Siembra con alumnos y datos de prueba
│   ├── services/
│   │   ├── asistencia.service.ts    # Lógica de cálculo, transacciones y turnos
│   │   └── estudiante.service.ts    # CRUD de alumnos y reportes de progreso
│   ├── controllers/
│   │   ├── asistencia.controller.ts # Handlers HTTP para /api/asistencia/*
│   │   └── estudiante.controller.ts # Handlers HTTP para /api/estudiantes/*
│   ├── routes/
│   │   ├── asistencia.routes.ts     # Enrutador de asistencia
│   │   └── estudiante.routes.ts     # Enrutador de estudiantes
│   └── generar-credenciales.ts      # Generador de tarjetas/gafetes imprimibles
├── public/
│   ├── index.html                   # Interfaz del Checador (Kiosko / Escáner)
│   ├── admin.html                   # Dashboard Administrativo y Reportes
│   ├── credenciales.html            # Gafetes imprimibles con QR para pruebas
│   ├── sw.js                        # Service Worker de la PWA
│   ├── manifest.json                # Manifiesto de la PWA
│   ├── css/styles.css               # Estilos modernos responsivos
│   ├── js/app.js                    # Lógica del cliente, cámara y audio
│   └── js/admin.js                  # Lógica del panel administrativo
├── data/
│   └── checador.db                  # Archivo de base de datos SQLite
├── package.json
└── tsconfig.json
```

---

## ⚙️ Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga en caliente (`tsx watch`). |
| `npm run build` | Compila el código TypeScript a JavaScript en la carpeta `dist/`. |
| `npm start` | Inicia el servidor de producción compilado (`node dist/index.js`). |
| `npm run db:seed` | Inicializa las tablas y siembra alumnos de prueba (`SS-2026-001`, etc.). |
| `npm run generar:credenciales` | Genera `public/credenciales.html` con gafetes y QRs de prueba. |

---

## 🌐 URLs de Acceso Rápido

Con el servidor corriendo en `http://localhost:3000`:

1. **Checador QR (Pantalla Principal):**
   `http://localhost:3000/index.html`
2. **Panel Administrativo & Métricas:**
   `http://localhost:3000/admin.html`
3. **Gafetes de Prueba para Escanear:**
   `http://localhost:3000/credenciales.html`
4. **Verificación de Salud (Healthcheck):**
   `http://localhost:3000/api/health`

---

## 📡 Referencia de la API REST

### 1. Asistencia
- **`POST /api/asistencia/scan`**
  - **Body:** `{ "codigo": "SS-2026-001" }`
  - **Respuesta (Entrada):**
    ```json
    {
      "ok": true,
      "data": {
        "tipo": "ENTRADA",
        "estudianteId": "SS-2026-001",
        "estudianteNombre": "Ana Sofía Rodríguez Pérez",
        "timestamp": 1792193253213,
        "horasAcumuladas": 20,
        "porcentajeAvance": 4.2,
        "mensaje": "¡Hola, Ana! Entrada registrada a las 05:27:33 p.m.."
      }
    }
    ```
  - **Respuesta (Salida):**
    ```json
    {
      "ok": true,
      "data": {
        "tipo": "SALIDA",
        "estudianteId": "SS-2026-001",
        "minutosSesion": 180,
        "horasAcumuladas": 23,
        "porcentajeAvance": 4.8,
        "mensaje": "¡Hasta luego, Ana! Turno completado: 3h 0m. Total acumulado: 23 hrs."
      }
    }
    ```
- **`GET /api/asistencia/activos`**: Devuelve los estudiantes con turno en curso y tiempo transcurrido en vivo.
- **`GET /api/asistencia/historial/:id`**: Retorna el registro histórico de turnos de un alumno.

### 2. Estudiantes
- **`GET /api/estudiantes`**: Lista todos los estudiantes con su saldo de horas y estado.
- **`POST /api/estudiantes`**: Da de alta un nuevo alumno (`id`, `nombre`, `carrera`, `horasObjetivo`).
- **`GET /api/estudiantes/:id/reporte`**: Resumen analítico de horas cumplidas, restantes y promedio.

---

## 🛡️ Guía de Mantenimiento y Parámetros de Negocio

- **Tiempo de debounce (`TOLERANCIA_DEBOUNCE_MS` en [asistencia.service.ts](file:///home/Computo/Proyectos/ChecadorServicioSocial/src/services/asistencia.service.ts)):**
  Por defecto en 30 segundos. Para cambiar la tolerancia mínima entre entrada y salida, ajustar la constante.
- **Límite máximo por turno (`LIMITE_TURNO_MAXIMO_HORAS`):**
  Configurado en 8 horas. Si un turno excede este valor sin marcar salida, el sistema genera automáticamente una observación para auditoría de un supervisor.
- **Modo Kiosko PWA:**
  Para instalar en una Tablet Android o iPad, abrir `http://<IP-DEL-SERVIDOR>:3000/index.html` en Chrome/Safari y presionar **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.
# ChecadorServicioSocial

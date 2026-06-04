# AutoRenova Backend API

Este es el backend para la plataforma **AutoRenova**, desarrollado en Node.js, Express y TypeScript. El proyecto sigue los principios de **Clean Architecture** (Arquitectura Limpia) y utiliza **Prisma ORM** con PostgreSQL en Supabase para almacenamiento relacional e imágenes.

---

## 🛠️ Tecnologías Obligatorias

*   **Runtime**: Node.js
*   **Servidor**: Express.js
*   **Lenguaje**: TypeScript
*   **Base de Datos**: PostgreSQL (Supabase)
*   **ORM**: Prisma
*   **Autenticación**: JWT (JSON Web Tokens)
*   **Encriptación**: Bcrypt
*   **Carga de Archivos**: Multer + Supabase Storage SDK

---

## 📂 Estructura de Carpetas (Clean Architecture)

```text
src/
├── domain/                  # Lógica de dominio pura (Sin dependencias externas)
│   ├── entities/            # Entidades de negocio (User, Vehicle, etc.)
│   ├── repositories/        # Interfaces de repositorios
│   ├── services/            # Interfaces de servicios de infraestructura
│   └── errors/              # Errores del dominio
│
├── application/             # Casos de uso de la aplicación
│   └── usecases/            # Lógica de negocio específica (Auth, Citas, Vehículos)
│
├── infrastructure/          # Implementación de detalles tecnológicos
│   ├── prisma/              # Migraciones y esquema
│   ├── prisma-client/       # Instancia singleton de PrismaClient
│   ├── repositories/        # Implementación con Prisma de las interfaces del dominio
│   ├── security/            # Implementación de hash (Bcrypt) y tokens (JWT)
│   ├── storage/             # Implementación de subida de imágenes (Supabase Storage)
│   ├── config/              # Centralización de variables de entorno
│   └── validators/          # Middleware y esquemas de validación Zod
│
└── interface/               # Capa de presentación HTTP
    ├── controllers/         # Mapeo de peticiones HTTP a casos de uso
    ├── middlewares/         # authMiddleware, adminMiddleware, errorMiddleware
    ├── routes/              # Enrutadores Express (v1)
    └── types/               # Tipos extendidos (Express Request)
```

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar e Instalar Dependencias
Dentro del directorio `backend-autorenova/`, ejecuta:
```bash
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto usando como guía el archivo `.env.example`:
```bash
cp .env.example .env
```
Rellena las variables requeridas (DATABASE_URL, JWT_SECRET, SUPABASE_URL, etc.).

### 3. Generar el Cliente de Prisma
```bash
npx prisma generate
```

### 4. Siembra de Base de Datos (Crear Administrador)
Genera el administrador por defecto (`ADMIN_EMAIL` y `ADMIN_PASSWORD` definidos en el archivo `.env`):
```bash
npm run seed
```

### 5. Correr en Desarrollo
Inicia el servidor con recarga automática:
```bash
npm run dev
```
El servidor correrá en: `http://localhost:5000/api/v1`

---

## 📋 Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo utilizando `tsx` y `nodemon`.
*   `npm run build`: Compila el código TypeScript a JavaScript en la carpeta `dist`.
*   `npm run start`: Arranca el servidor compilado (`node dist/index.js`).
*   `npm run seed`: Ejecuta el script de semilla para poblar la base de datos con el usuario administrador.

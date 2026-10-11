## Custom PC Builder API

API RESTful para la gestión de inventario y ensamblaje de PCs personalizadas. Desarrollada con **Node.js**, **Express**, **Prisma ORM** y **SQL Server**.

---

##  Descripción del Proyecto

Sistema backend que permite:
- Gestionar **Proveedores** de componentes de PC.
- Administrar el **inventario de componentes** (CPU, GPU, RAM, etc.).
- Registrar **Clientes**.
- Crear **Armados (ensamblajes)** de PCs, calculando automáticamente el total y descontando el stock de los componentes utilizados.

Este proyecto fue desarrollado como parte del **Proyecto de Parcial**.

---

##  Arquitectura

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│ CLIENTE │ │ API REST │ │ BASE DE DATOS │
│ (Swagger UI / │─────▶│ Node.js │─────▶│ SQL Server │
│ Postman) │◀─────│ Express │◀─────│ custom_pc_builder │
│ │ │ Prisma ORM │ │ 5 tablas │
└─────────────────┘ └─────────────────┘ └─────────────────────┘


---

## 🛠️ Tecnologías Utilizadas

- **Node.js** v18+
- **Express** - Framework web
- **Prisma ORM** - Acceso a datos
- **SQL Server** - Base de datos relacional
- **Swagger UI** - Documentación interactiva
- **dotenv** - Manejo de variables de entorno
- **cors** - Seguridad de peticiones cruzadas
- **nodemon** - Desarrollo en caliente

---

## 📁 Estructura del Proyecto

custom-pc-builder/
├── prisma/
│ ├── schema.prisma # Definición de modelos
│ └── migrations/ # Historial de migraciones
├── src/
│ ├── controllers/ # Lógica de negocio
│ │ ├── proveedorController.js
│ │ ├── clienteController.js
│ │ ├── componenteController.js
│ │ └── armadoController.js
│ ├── routes/ # Definición de endpoints
│ │ ├── proveedorRoutes.js
│ │ ├── clienteRoutes.js
│ │ ├── componenteRoutes.js
│ │ └── armadoRoutes.js
│ ├── lib/
│ │ └── prisma.js # Cliente de Prisma
│ ├── swagger.js # Configuración de Swagger
│ └── index.js # Punto de entrada del servidor
├── .env # Variables de entorno (NO se sube a GitHub)
├── .gitignore # Archivos ignorados por Git
├── package.json
└── README.md


---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js v18 o superior.
- SQL Server (Express o Developer) instalado y corriendo.
- Git instalado.

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/custom-pc-builder.git
cd custom-pc-builder



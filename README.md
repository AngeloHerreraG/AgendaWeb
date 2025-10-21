# AgendaWeb – Agenda Dinámica para Profesionales

AgendaWeb es una aplicación web Full-Stack construida con el stack MERN (MongoDB, Express, React, Node.js) y TypeScript, diseñada para que profesionales independientes y sus clientes gestionen citas de manera simple y segura.

La plataforma permite a los profesionales definir su disponibilidad, y a los clientes agendar horas de forma intuitiva. Además, incorpora un asistente de IA (Gemini API) para ayudar a los profesionales a completar la descripción de sus perfiles.

## Tecnologías Utilizadas
### Frontend:
- React 18 con Vite
- TypeScript
- CSS tradicional para estilos
- Axios para peticiones HTTP
### Backend:
- Node.js con Express
- TypeScript
- MongoDB como base de datos
- Mongoose
- JSON Web Tokens (JWT) para autenticación
- Cookies y Headers para protección CSRF

## Estructura del ProyectoAgendaWeb/
```
├── frontend/           # Aplicación en React + TypeScript
│   └── src/
│       ├── components/
│       ├── services/
│       └── ...
├── backend/            # Servidor en Node.js + Express + TypeScript
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── middleware/
│       └── ...
└── README.md           # Este archivo
```

## Pre-requisitos

- Node.js (v18+ recomendado)
- npm o yarn
- MongoDB en puerto 27017 (una instancia local o en la nube como MongoDB Atlas)

## Instalación y Ejecución Local

Sigue estos pasos para levantar el proyecto en tu máquina local.
1. Clonar el Repositorio
 [https://github.com/AngeloHerreraG/AgendaWeb](https://github.com/AngeloHerreraG/AgendaWeb)

2. Configuración del Backend
    1. Navega a la carpeta del backend

        ```cd backend```
    2. Instala las dependencias
    
        ```npm install```
    3. Asegurarse de tener las variables de entorno en 

        ```backend/```
        - Si bien no se deberia subir las variables al repositorio, esto es netamente pedagogico y no afecta que este en el repositorio
    4. Ejecuta el servidor en modo de desarrollo
    
        ```npm run dev```
        - El servidor se ejecutará en http://localhost:9002 (o el puerto que definas).

    PRECAUCIÓN: En el archivo models/profesional.ts, el código desde la linea 58 a la 61 es para añadir profesionales a la base de datos automáticamente una vez de ejecuta el servidor. Por lo tanto, desde la segunda ejecución, se deben comentar esas lineas para que no se intente agregar datos duplicados a la base de datos.

3. Configuración del Frontend
    1. Abre una nueva terminal y navega a la carpeta del frontend
        
        ```cd frontend```
    2. Instala las dependencias

        ```npm install```

    3. Ejecuta la aplicación de React
        
        ```npm run dev``` o ```npm run build```
        - El frontend estará disponible en http://localhost:9001
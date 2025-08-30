# AgendaWeb – Agenda Dinámica para Profesionales

AgendaWeb es una aplicación web para que profesionales independientes y sus clientes gestionen citas de manera simple y segura.


## Estructura del proyecto

```
AgendaWeb/
├── frontend/       # React + TypeScript (Vite)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/        # json-server mock API
│   ├── db.json
│   ├── package.json
│   └── README.md
└── README.md       # este archivo

```

## Requisitos

- Node.js
- npm
- Navegador moderno como Chrome o Edge

## Instrucciones

### 1. Para el backend
- Abrir la terminal parados en ```/backend```
- Instalar las dependencias (solo la primera vez) con ```npm install```
- Levantar el servidor con ```npm start```
    - Esto levantara el servidor en localhost en el puerto 9002
    - Un ejemplo de llamado a la API ```GET http://localhost:9002/users```

### 2. Para el frontend
- Abrir otra terminal parados en ```/frontend```
- Instalar las dependencias (solo la primera vez) con ```npm install```
- Ejecutar la app con ```npm run dev```
    - Esto levantara el front en localhost en el puerto 9001

## Notas
- Los dos servicios o procesos deben estar levantados en simultaneo, para que se comuniquen
- Los procesos deben correr en puertos distintos
- Asegurarse de correr primero el backend para que el front funcione correctamente
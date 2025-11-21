# AgendaWeb – Plataforma de Gestión de Citas

## 1. Tema General del Proyecto
AgendaWeb es una aplicación web **Full-Stack** diseñada para facilitar la conexión entre profesionales independientes y sus clientes. La plataforma permite resolver dos problemas principales:
1.  **Para Profesionales:** Ofrece una herramienta para definir disponibilidad horaria, configurar bloques de atención y gestionar su perfil público.
2.  **Para Clientes:** Proporciona una interfaz intuitiva para buscar profesionales, visualizar sus horarios disponibles y reservar citas.

El sistema está construido sobre el stack **MERN** (MongoDB, Express, React, Node.js) utilizando **TypeScript** en ambos extremos para asegurar la robustez del código.

## 2. Estructura del Estado Global
Para la gestión del estado global se utilizó la librería **Zustand**. Se eligió por su simplicidad, bajo *boilerplate* y capacidad para manejar acciones asíncronas fuera de los componentes de React.

La arquitectura se divide en dos **Stores** principales para separar responsabilidades:

### A. `useAuthStore` (Store de Identidad)
Maneja todo lo relacionado con "Quién es el usuario".
* **Estado:** Almacena el objeto `user` (con datos completos poblados desde la DB), `authStatus` ('loading', 'authenticated', 'unauthenticated').
* **Responsabilidad:** Gestiona el Login, Logout, verificación de sesión al inicio (`checkAuth`) y la actualización de datos del perfil del usuario logueado.
* **Lógica Clave:** Implementa un patrón de verificación donde el login autentica credenciales y simultáneamente obtiene el perfil completo del usuario (incluyendo roles y datos específicos) para asegurar consistencia.

### B. `useScheduleStore` (Store de Característica / Vista)
Actúa como un controlador para la vista compleja de horarios (`/professional/:id`).
* **Estado:** Almacena `professionalData` (perfil que se está visitando), `scheduleData` (lista de citas), `selectedDay` y `scheduleStatus`.
* **Responsabilidad:** Centraliza la lógica de obtener datos del profesional y sus horarios en una sola llamada, filtrar citas por día seleccionado, y gestionar operaciones CRUD (crear, editar, eliminar bloques) actualizando la interfaz de forma reactiva.

## 3. Mapa de Rutas y Flujo de Autenticación

### Mapa de Rutas (React Router)
| Ruta | Descripción | Protección |
| :--- | :--- | :--- |
| `/login` | Inicio de sesión | Pública |
| `/register` | Registro de nuevos usuarios | Pública |
| `/home/:id` | Dashboard principal con lista de profesionales | **Privada** |
| `/professional/:id` | Vista de calendario y gestión de citas | **Privada** |
| `/profile/:id` | Perfil de usuario (propio o de terceros) | **Privada** |
| `/admin-home` | Panel de administración | **Privada (Rol Admin)** |

### Flujo de Autenticación
La autenticación es segura y persistente, utilizando **JWT (JSON Web Tokens)** y **Cookies HTTPOnly**.

1.  **Login:** El usuario envía credenciales. El backend valida y devuelve un token JWT en una cookie `httpOnly` (invisible para JS) y un `csrfToken` en los headers.
2.  **Persistencia:** Al recargar la página (F5), `App.tsx` ejecuta `useAuthStore.getState().checkAuth()`. Esto llama al endpoint `/api/login/me`. Si la cookie es válida, el backend devuelve el usuario y la sesión se restaura automáticamente.
3.  **Protección:** Los componentes protegidos verifican el estado `authStatus` del store. Si es `unauthenticated`, redirigen a `/login`.

## 4. Descripción de los Tests E2E
Para las pruebas de extremo a extremo (End-to-End) se utilizó la herramienta **Playwright**. Se eligió por su velocidad, fiabilidad y capacidad para manejar múltiples navegadores.

**Flujos cubiertos:**
1.  **Autenticación (`login.spec.ts`):**
    * Login exitoso con credenciales válidas.
    * Manejo de errores con credenciales inválidas.
    * Protección de rutas (redirección forzada si no hay sesión).
2.  **Gestión de Citas (`scheduleBlock.spec.ts`):**
    * **Flujo Cliente:** Navegar a un profesional, seleccionar un día, hacer clic en un bloque vacío y crear una reserva ("pendiente").
    * **Flujo Profesional:** Entrar a su propio horario, ver la cita pendiente, cambiar estado a "cancelado" o "bloqueado", y eliminar el bloque definitivamente.

## 5. Librería de Estilos y Diseño
El proyecto utiliza **CSS Tradicional** estructurado por componentes (ej. `horario.css`, `navbar.css`) junto con variables CSS globales para mantener la consistencia del tema.

* **Paleta de Colores:** Se definieron variables (`--color1` a `--color11`) en `index.css` basadas en tonos azules para transmitir confianza y profesionalismo.
* **Tipografía:** Se utiliza la fuente **'Poppins'** para toda la aplicación, asegurando una lectura moderna y limpia.
* **Librería de Componentes:** Se integró **Material UI (@mui/icons-material)** exclusivamente para la iconografía, manteniendo el peso del bundle bajo al no depender de librerías de componentes pesadas para la estructura.
* **Diseño Responsivo:** Se utilizaron Grid y Flexbox para adaptar vistas complejas (como el calendario y los chips de horarios) a diferentes tamaños de pantalla.

## 6. Despliegue
La aplicación se encuentra desplegada y operativa en la siguiente dirección:

**URL:** [http://fullstack.dcc.uchile.cl:7110](http://fullstack.dcc.uchile.cl:7110)

---

## Ejecución Local (Desarrollo)

1.  **Clonar repositorio:**
    ```bash
    git clone [https://github.com/AngeloHerreraG/AgendaWeb](https://github.com/AngeloHerreraG/AgendaWeb)
    ```
2.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
3.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
# 🚀 Super Notas - Real-Time Collaborative Notepad

Una aplicación de notas premium, multiplataforma y con sincronización en tiempo real. Esta versión ha sido refinada y optimizada por **Antigravity (Gemini 3 Flash)** para ofrecer la mejor experiencia de usuario y un código limpio.

![Plataformas](https://img.shields.io/badge/Plataforma-Android%20%7C%20iOS%20%7C%20Web-blue)
![Firebase](https://img.shields.io/badge/Database-Firebase%20Realtime%20Database-yellow)


## ✨ Características Principales

-   **Campo Único Multi-línea**: Diseño simplificado con un solo campo de texto para capturar ideas rápidamente.
-   **Sincronización Real-Time**: Los cambios se reflejan instantáneamente en todos los dispositivos conectados mediante **Firebase Realtime Database**.
-   **Diseño Premium Responsivo**:
    -   Estética "Glassmorphism" con gradientes profundos.
    -   Optimizado para móviles y escritorio (ancho máximo controlado en web).
    -   Animaciones sutiles y feedback visual claro.
-   **Gestión Completa (CRUD)**: Crea, lee, actualiza y elimina notas de forma intuitiva.

## 🛠️ Tecnologías y Herramientas

-   **Modelo de IA**: Gemini 3 Flash (Optimización de código, diseño de UI y documentación).
-   **Frontend**: React Native con Expo SDK 54.
-   **Base de Datos**: Firebase Realtime Database.
-   **Iconografía**: Lucide React Native.
-   **Estilos**: StyleSheet + Expo Linear Gradient (Glassmorphism design).

## 🔄 Flujo de Datos

1.  **Entrada**: El usuario escribe en el campo multi-línea.
2.  **Persistencia**: Al presionar "Añadir", los datos se envían a la ruta `/mensaje` en Firebase con un ID único generado automáticamente.
3.  **Sincronización**: La aplicación escucha cambios en la base de datos mediante `onValue`. Cualquier inserción o eliminación actualiza el estado de React en todos los clientes.
4.  **Actualización Global**: Se actualiza el campo `ultimo_mensaje` para rastrear la actividad global.

## 📁 Estructura del Proyecto

```text
blog-notas/
├── .expo/               # Configuración interna de Expo
├── assets/              # Imágenes, iconos y fuentes
├── App.js               # Archivo principal (Lógica, UI y Firebase sync)
├── firebaseConfig.js    # Credenciales y conexión a Realtime Database
├── app.json             # Metadatos de la app (Nombre, icono, splash)
├── package.json         # Dependencias y scripts de ejecución
└── README.md            # Documentación del proyecto
```

-   **`App.js`**: El núcleo de la aplicación. Maneja el estado de las notas, la integración con la base de datos y el diseño responsivo.
-   **`firebaseConfig.js`**: Centraliza la configuración de seguridad y conexión con los servicios de Google Firebase.
-   **`package.json`**: Define las librerías necesarias como `lucide-react-native` y `expo-linear-gradient`.

## 🚀 Instalación y Ejecución

1.  **Clonar/Entrar a la carpeta**:
    ```bash
    cd blog-notas
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configuración de Firebase**:
    -   Las credenciales ya han sido pre-configuradas en `firebaseConfig.js` basándose en los parámetros del proyecto.
    -   Asegúrate de tener habilitado **Realtime Database** en tu consola de Firebase.

4.  **Iniciar**:
    ```bash
    npx expo start
    ```

## 📱 Visualización

-   **Móvil**: Escanea el código QR con la app **Expo Go**.
-   **Web**: Presiona `w` en la terminal o abre `http://localhost:8081`.

---
Desarrollado y optimizado por **Antigravity AI**

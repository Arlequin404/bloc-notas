import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración de Firebase obtenida de la consola del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyBOjcAHUpmPLjhAjJIbNGiX_u5lLuBYdVo",
  authDomain: "proyecto-grupal-3a826.firebaseapp.com",
  databaseURL: "https://proyecto-grupal-3a826-default-rtdb.firebaseio.com",
  projectId: "proyecto-grupal-3a826",
  storageBucket: "proyecto-grupal-3a826.firebasestorage.app",
  messagingSenderId: "1082669652963",
  appId: "1:1082669652963:web:e71415418b7600868f02f9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
// Inicializar Realtime Database
const db = getDatabase(app);

export { db };

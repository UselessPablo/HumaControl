// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAGSciUG2JftwniPRLrUIJWfDI1xgI-hIQ",
    authDomain: "humacontrol.firebaseapp.com",
    databaseURL: "https://humacontrol-default-rtdb.firebaseio.com",
    projectId: "humacontrol",
    storageBucket: "humacontrol.firebasestorage.app",
    messagingSenderId: "191837313309",
    appId: "1:191837313309:web:7c32f27d31c0fbbb1ae9f4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la base de datos para usarla en otros archivos
const db = getDatabase(app);

export { db };

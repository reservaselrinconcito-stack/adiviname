export const challenges = [
    // --- 1. ADIVINANZAS CLÁSICAS (RIDDLE) ---
    {
        id: "r1",
        type: "riddle",
        difficulty: 1,
        question: "¿Qué sube pero nunca baja?",
        answer: "La edad",
        explanation: "El tiempo solo avanza hacia adelante.",
        tags: ["clasica", "facil"]
    },
    {
        id: "r2",
        type: "riddle",
        difficulty: 2,
        question: "Cuanto más quitas, más grande es. ¿Qué es?",
        answer: "Un agujero",
        explanation: "Al quitar tierra, el espacio vacío crece.",
        tags: ["enganosa", "espacio"]
    },
    {
        id: "r3",
        type: "riddle",
        difficulty: 1,
        question: "Blanco por dentro, verde por fuera. Si quieres que te lo diga, espera.",
        answer: "Pera",
        explanation: "Es un juego de palabras: 'es-pera'.",
        tags: ["fruta", "infantil"]
    },
    {
        id: "r4",
        type: "riddle",
        difficulty: 2,
        question: "¿Qué tiene ciudades sin casas, ríos sin agua y montañas sin tierra?",
        answer: "Un mapa",
        explanation: "Es una representación gráfica.",
        tags: ["logica", "geografia"]
    },

    // --- 2. RETOS LÓGICOS (LOGIC) ---
    {
        id: "l1",
        type: "logic",
        difficulty: 2,
        question: "2, 4, 8, 16, ?",
        options: ["18", "24", "32", "64"],
        answer: "32",
        explanation: "Cada número se multiplica por 2.",
        tags: ["patron", "math"]
    },
    {
        id: "l2",
        type: "logic",
        difficulty: 2,
        question: "Si 3 = 6 y 4 = 12, entonces 5 = ?",
        options: ["15", "20", "25", "30"],
        answer: "20",
        explanation: "El patrón es n * (n-1) o simplemente n * 4 en este caso simplificado.",
        tags: ["numeros"]
    },
    {
        id: "l3",
        type: "logic",
        difficulty: 1,
        question: "¿Qué pesa más?",
        options: ["1kg de Hierro", "1kg de Plumas", "Iguales"],
        answer: "Iguales",
        explanation: "Ambos pesan exactamente 1kg.",
        tags: ["fisica", "trampa"]
    },

    // --- 3. PREGUNTAS TRAMPA (TRICK) ---
    {
        id: "t1",
        type: "trick",
        difficulty: 2,
        question: "¿Cuántos meses tienen 28 días?",
        options: ["1 (Febrero)", "Todos", "Depende del año"],
        answer: "Todos",
        explanation: "Todos los meses tienen al menos 28 días.",
        tags: ["trampa", "calendario"]
    },
    {
        id: "t2",
        type: "trick",
        difficulty: 3,
        question: "Un avión se estrella en la frontera entre España y Francia. ¿Dónde entierran a los supervivientes?",
        options: ["España", "Francia", "No se entierran"],
        answer: "No se entierran",
        explanation: "¡Son supervivientes! Están vivos.",
        tags: ["lateral", "humor"]
    },

    // --- 4. PATRONES VISUALES (PATTERN) ---
    {
        id: "p1",
        type: "pattern",
        difficulty: 1,
        question: "🟥 🟦 🟥 🟦 ?",
        options: ["🟥", "🟦", "🟩", "🟨"],
        answer: "🟥",
        explanation: "Sigue la secuencia alternada.",
        tags: ["visual", "color"]
    },
    {
        id: "p2",
        type: "pattern",
        difficulty: 2,
        question: "⬆️ ➡️ ⬇️ ?",
        options: ["↗️", "⬅️", "⬆️", "↘️"],
        answer: "⬅️",
        explanation: "Gira 90 grados a la derecha cada vez.",
        tags: ["visual", "flechas"]
    },

    // --- 5. LÓGICA LATERAL (LATERAL) ---
    {
        id: "lat1",
        type: "lateral",
        difficulty: 3,
        question: "Un hombre entra a un bar y pide agua. El camarero le apunta con una pistola. El hombre dice gracias y se va. ¿Por qué?",
        options: ["Era un atraco", "Tenía hipo", "Estaba loco"],
        answer: "Tenía hipo",
        explanation: "El susto le quitó el hipo, que era lo que necesitaba.",
        tags: ["historia", "lateral"]
    }
];

// Compatibilidad
export const riddles = challenges;

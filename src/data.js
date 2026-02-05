export const challenges = [
    // --- SPANISH (ES) ---
    // RIDDLES
    { id: 101, lang: "es", type: "RIDDLE", difficulty: 1, text: "Blanco por dentro, verde por fuera. Si quieres que te lo diga, espera.", answer: "Pera", hint: "Fruta" },
    { id: 102, lang: "es", type: "RIDDLE", difficulty: 1, text: "Oro parece, plata no es. Quien no lo adivine, bien tonto es.", answer: "Plátano", hint: "Fruta amarilla" },
    { id: 103, lang: "es", type: "RIDDLE", difficulty: 1, text: "Tiene dientes y no come, tiene cabeza y no es hombre.", answer: "Ajo", hint: "Cocina" },
    { id: 104, lang: "es", type: "RIDDLE", difficulty: 1, text: "Vuelo de noche, duermo de día y nunca verás plumas en el ala mía.", answer: "Murciélago", hint: "Animal" },

    // LOGIC (Multiple Choice)
    {
        id: 150,
        lang: "es",
        type: "LOGIC",
        difficulty: 1,
        text: "¿Qué pesa más?",
        options: ["1kg de Hierro", "1kg de Plumas", "Iguales"],
        correctOption: 2, // Index 0-based
        hint: "Lee bien la cantidad."
    },
    {
        id: 151,
        lang: "es",
        type: "LOGIC",
        difficulty: 2,
        text: "El padre de Ana tiene 4 hijas: Nana, Nene, Nini... ¿Cómo se llama la cuarta?",
        options: ["Nono", "Nunu", "Ana"],
        correctOption: 2,
        hint: "Lee el principio de la frase."
    },

    // MATH / PATTERN
    {
        id: 160,
        lang: "es",
        type: "MATH",
        difficulty: 2,
        text: "2, 4, 8, 16...",
        options: ["20", "24", "32", "18"],
        correctOption: 2,
        hint: "El doble del anterior."
    },

    // TRICK (Brain Teasers)
    {
        id: 170,
        lang: "es",
        type: "TRICK",
        difficulty: 3,
        text: "¿Cuántos meses tienen 28 días?",
        options: ["1 (Febrero)", "Todos", "Depende del año"],
        correctOption: 1,
        hint: "Piénsalo... ¿Enero tiene 28 días? Sí, y más."
    }
];

// Combine for backward compatibility
export const riddles = challenges;

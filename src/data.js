// --- 1. STATIC LIBRARY (Handcrafted Quality) ---
export const staticChallenges = [
    { id: "r1", type: "riddle", difficulty: 1, question: "¿Qué sube pero nunca baja?", answer: "La edad", explanation: "El tiempo solo avanza.", tags: ["clasica"] },
    { id: "r2", type: "riddle", difficulty: 2, question: "Cuanto más quitas, más grande es. ¿Qué es?", answer: "Un agujero", explanation: "El vacío crece.", tags: ["logica"] },
    { id: "r3", type: "riddle", difficulty: 1, question: "Blanco por dentro, verde por fuera. Si quieres que te lo diga, espera.", answer: "Pera", explanation: "Es-pera.", tags: ["fruta"] },
    { id: "r4", type: "riddle", difficulty: 2, question: "¿Qué tiene ciudades sin casas, ríos sin agua y montañas sin tierra?", answer: "Un mapa", explanation: "Representación gráfica.", tags: ["geografia"] },
    { id: "r5", type: "riddle", difficulty: 1, question: "Tiene dientes y no come. ¿Qué es?", answer: "El ajo", explanation: "Dientes de ajo.", tags: ["cocina"] },
    { id: "t1", type: "trick", difficulty: 2, question: "¿Cuántos meses tienen 28 días?", options: ["1 (Febrero)", "Todos", "Ninguno"], answer: "Todos", explanation: "Todos tienen al menos 28.", tags: ["trampa"] },
    { id: "t2", type: "trick", difficulty: 3, question: "Un avión cae en la frontera de España y Francia. ¿Dónde entierran a los supervivientes?", options: ["España", "Francia", "No se entierran"], answer: "No se entierran", explanation: "¡Están vivos!", tags: ["trampa"] },
    { id: "lat1", type: "lateral", difficulty: 3, question: "Entras a una habitación oscura con una vela y una lámpara de gas. Solo tienes una cerilla. ¿Qué enciendes primero?", options: ["La vela", "La lámpara", "La cerilla"], answer: "La cerilla", explanation: "Sin ella no enciendes nada.", tags: ["logica"] },
];

/**
 * --- 2. PROCEDURAL GENERATORS (The "Infinite" Engine) ---
 * Generates unique puzzles on the fly based on math, logic, and patterns.
 */

// A. MATH GENERATOR: Mental Arithmetic
function generateMath() {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 20) + 1; // 1-20
    let b = Math.floor(Math.random() * 10) + 1; // 1-10

    let res, question;

    if (op === '+') { res = a + b; question = `${a} + ${b} = ?`; }
    if (op === '-') {
        if (a < b) [a, b] = [b, a]; // Avoid negative for simplicity
        res = a - b;
        question = `${a} - ${b} = ?`;
    }
    if (op === '*') {
        a = Math.floor(Math.random() * 10) + 1; // Smaller numbers for multid
        b = Math.floor(Math.random() * 5) + 1;
        res = a * b;
        question = `${a} × ${b} = ?`;
    }

    // Generate distraction options
    const options = new Set([res]);
    while (options.size < 4) {
        let offset = Math.floor(Math.random() * 5) + 1;
        if (Math.random() > 0.5) offset *= -1;
        options.add(res + offset);
    }

    return {
        id: `math_${Date.now()}_${Math.random()}`,
        type: "math",
        difficulty: 1,
        question: question,
        options: Array.from(options).sort((x, y) => x - y).map(String),
        answer: res.toString(),
        explanation: "Cálculo mental rápido.",
        tags: ["math", "infinito"]
    };
}

// B. SERIES GENERATOR: Logic Sequences
function generateSeries() {
    const types = ['arithmetic', 'geometric', 'fibonacci'];
    const type = types[Math.floor(Math.random() * types.length)];

    let seq = [];
    let nextVal;
    let explanation;

    if (type === 'arithmetic') {
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2;
        seq = [start, start + step, start + step * 2, start + step * 3];
        nextVal = start + step * 4;
        explanation = `Suma ${step} al anterior.`;
    } else if (type === 'geometric') {
        const start = Math.floor(Math.random() * 3) + 1;
        const mult = 2;
        seq = [start, start * mult, start * mult * mult, start * mult * mult * mult];
        nextVal = start * mult * mult * mult * mult;
        explanation = `Multiplica por ${mult} cada vez.`;
    } else { // fibonacci-like
        let a = Math.floor(Math.random() * 5) + 1;
        let b = a + Math.floor(Math.random() * 3);
        seq = [a, b, a + b, a + b + b];
        nextVal = (a + b) + (a + b + b);
        explanation = "Suma los dos anteriores.";
    }

    const options = new Set([nextVal]);
    while (options.size < 4) {
        let offset = Math.floor(Math.random() * 10) + 1;
        options.add(nextVal + (Math.random() > 0.5 ? offset : -offset));
    }

    return {
        id: `seq_${Date.now()}_${Math.random()}`,
        type: "pattern",
        difficulty: 2,
        question: `${seq.join(", ")} ...?`,
        options: Array.from(options).sort((x, y) => x - y).map(String),
        answer: nextVal.toString(),
        explanation: explanation,
        tags: ["series", "logica"]
    };
}

// C. VISUAL PATTERN GENERATOR (Emojis)
function generateVisual() {
    const emojis = ['🟥', '🟦', '🟩', '🟨', '🟣', '🟠'];
    // Pick 2 distinct emojis
    const sub = emojis.sort(() => 0.5 - Math.random()).slice(0, 2);
    const [e1, e2] = sub;

    const patterns = [
        { q: `${e1} ${e2} ${e1} ${e2} ?`, a: e1, exp: "Alternancia simple." },
        { q: `${e1} ${e1} ${e2} ${e2} ${e1} ?`, a: e1, exp: "Pares dobles." },
        { q: `${e1} ${e2} ${e2} ${e1} ${e2} ?`, a: e2, exp: "Patrón 1-2-1-2" }
    ];

    const p = patterns[Math.floor(Math.random() * patterns.length)];

    return {
        id: `vis_${Date.now()}_${Math.random()}`,
        type: "visual",
        difficulty: 1,
        question: p.q,
        options: [e1, e2],
        answer: p.a,
        explanation: p.exp,
        tags: ["visual", "patron"]
    };
}

// --- MASTER GENERATOR ---
export function getChallenge() {
    const rand = Math.random();

    // 30% Chance: Static Library Question
    if (rand < 0.3) {
        return staticChallenges[Math.floor(Math.random() * staticChallenges.length)];
    }

    // 70% Chance: Procedural (Infinite Content)
    // Even split between Math, Series, Visual
    const procRand = Math.random();
    if (procRand < 0.33) return generateMath();
    if (procRand < 0.66) return generateSeries();
    return generateVisual();
}

// Export array for legacy compatibility, though specific generator is preferred
export const challenges = staticChallenges;

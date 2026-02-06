/**
 * --- MULTILINGUAL DICTIONARY ---
 */
const STRINGS = {
    es: {
        calc: "Cálculo",
        seq: "Serie",
        vis: "Visual",
        math_q: "Cálculo mental rápido.",
        seq_add: (n) => `Suma ${n} al anterior.`,
        seq_mult: (n) => `Multiplica por ${n} cada vez.`,
        seq_fib: "Suma los dos anteriores.",
        vis_simple: "Alternancia simple.",
        vis_double: "Pares dobles.",
        vis_pat: "Patrón 1-2-1-2",
        tags_math: ["mates", "infinito"],
        tags_logic: ["logica", "series"],
        tags_visual: ["visual", "patron"]
    },
    cat: {
        calc: "Càlcul",
        seq: "Sèrie",
        vis: "Visual",
        math_q: "Càlcul mental ràpid.",
        seq_add: (n) => `Suma ${n} a l'anterior.`,
        seq_mult: (n) => `Multiplica per ${n} cada vegada.`,
        seq_fib: "Suma els dos anteriors.",
        vis_simple: "Alternança simple.",
        vis_double: "Parells dobles.",
        vis_pat: "Patró 1-2-1-2",
        tags_math: ["mates", "infinit"],
        tags_logic: ["lògica", "sèries"],
        tags_visual: ["visual", "patró"]
    },
    gal: {
        calc: "Cálculo",
        seq: "Serie",
        vis: "Visual",
        math_q: "Cálculo mental rápido.",
        seq_add: (n) => `Suma ${n} ao anterior.`,
        seq_mult: (n) => `Multiplica por ${n} cada vez.`,
        seq_fib: "Suma os dous anteriores.",
        vis_simple: "Alternancia simple.",
        vis_double: "Pares dobres.",
        vis_pat: "Patrón 1-2-1-2",
        tags_math: ["mates", "infinito"],
        tags_logic: ["lóxica", "series"],
        tags_visual: ["visual", "patrón"]
    },
    eus: {
        calc: "Kalkulua",
        seq: "Segida",
        vis: "Bisuala",
        math_q: "Buruketak azkar.",
        seq_add: (n) => `Gehitu ${n} aurrekoari.`,
        seq_mult: (n) => `Biderkatu ${n}-rekin aldiro.`,
        seq_fib: "Gehitu aurreko biak.",
        vis_simple: "Txandakatze sinplea.",
        vis_double: "Bikote bikoitzak.",
        vis_pat: "1-2-1-2 eredua",
        tags_math: ["mates", "infinitua"],
        tags_logic: ["logika", "segidak"],
        tags_visual: ["bisuala", "eredua"]
    },
    aran: {
        calc: "Calcul",
        seq: "Seria",
        vis: "Visuau",
        math_q: "Calcul mentau rapid.",
        seq_add: (n) => `Hè mès ${n} ar anterior.`,
        seq_mult: (n) => `Multiplica per ${n} cada viatge.`,
        seq_fib: "Hè mès es dus anteriors.",
        vis_simple: "Alternança simpla.",
        vis_double: "Parelhs dobles.",
        vis_pat: "Patron 1-2-1-2",
        tags_math: ["mates", "infinit"],
        tags_logic: ["logica", "series"],
        tags_visual: ["visuau", "patron"]
    }
};

// Fallback to ES if lang missing
const getStrings = (lang) => STRINGS[lang] || STRINGS['es'];

// --- 1. STATIC LIBRARY (Handcrafted) ---
// Note: In production this would be massive. For now we filter static by lang or use universal logic.
export const staticChallenges = [
    { id: "r1_es", lang: "es", type: "riddle", difficulty: 1, question: "¿Qué sube pero nunca baja?", answer: "La edad", explanation: "El tiempo solo avanza.", tags: ["clasica"] },
    { id: "r1_cat", lang: "cat", type: "riddle", difficulty: 1, question: "Què puja però mai baixa?", answer: "L'edat", explanation: "El temps només avança.", tags: ["clàssica"] },
    { id: "r1_gal", lang: "gal", type: "riddle", difficulty: 1, question: "Que sobe pero nunca baixa?", answer: "A idade", explanation: "O tempo só avanza.", tags: ["clásica"] },
    { id: "r1_eus", lang: "eus", type: "riddle", difficulty: 1, question: "Zer igotzen da baina inoiz ez da jaisten?", answer: "Adina", explanation: "Denbora aurrera doa.", tags: ["klasikoa"] },
    // Add more static content per language here...
];

/**
 * --- 2. PROCEDURAL GENERATORS (Multilingual) ---
 */

function generateMath(lang) {
    const s = getStrings(lang);
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 10) + 1;

    let res, question;

    if (op === '+') { res = a + b; question = `${a} + ${b} = ?`; }
    if (op === '-') {
        if (a < b) [a, b] = [b, a];
        res = a - b;
        question = `${a} - ${b} = ?`;
    }
    if (op === '*') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 5) + 1;
        res = a * b;
        question = `${a} × ${b} = ?`;
    }

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
        explanation: s.math_q,
        tags: s.tags_math
    };
}

function generateSeries(lang) {
    const s = getStrings(lang);
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
        explanation = s.seq_add(step);
    } else if (type === 'geometric') {
        const start = Math.floor(Math.random() * 3) + 1;
        const mult = 2;
        seq = [start, start * mult, start * mult * mult, start * mult * mult * mult];
        nextVal = start * mult * mult * mult * mult;
        explanation = s.seq_mult(mult);
    } else {
        let a = Math.floor(Math.random() * 5) + 1;
        let b = a + Math.floor(Math.random() * 3);
        seq = [a, b, a + b, a + b + b];
        nextVal = (a + b) + (a + b + b);
        explanation = s.seq_fib;
    }

    const options = new Set([nextVal]);
    while (options.size < 4) {
        let offset = Math.floor(Math.random() * 10) + 1;
        options.add(nextVal + (Math.random() > 0.5 ? offset : -offset));
    }

    return {
        id: `seq_${Date.now()}_${Math.random()}`,
        type: "pattern", // "Series" in UI logic
        difficulty: 2,
        question: `${seq.join(", ")} ...?`,
        options: Array.from(options).sort((x, y) => x - y).map(String),
        answer: nextVal.toString(),
        explanation: explanation,
        tags: s.tags_logic
    };
}

function generateVisual(lang) {
    const s = getStrings(lang);
    const emojis = ['🟥', '🟦', '🟩', '🟨', '🟣', '🟠'];
    const sub = emojis.sort(() => 0.5 - Math.random()).slice(0, 2);
    const [e1, e2] = sub;

    const patterns = [
        { q: `${e1} ${e2} ${e1} ${e2} ?`, a: e1, exp: s.vis_simple },
        { q: `${e1} ${e1} ${e2} ${e2} ${e1} ?`, a: e1, exp: s.vis_double },
        { q: `${e1} ${e2} ${e2} ${e1} ${e2} ?`, a: e2, exp: s.vis_pat }
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
        tags: s.tags_visual
    };
}

// --- MASTER GENERATOR ---
export function getChallenge(lang = 'es') {
    const rand = Math.random();

    // 20% Chance: Static Library Question (Filtered by language)
    if (rand < 0.2) {
        const langPool = staticChallenges.filter(c => c.lang === lang);
        if (langPool.length > 0) {
            return langPool[Math.floor(Math.random() * langPool.length)];
        }
    }

    // 80% Chance (or fallback): Procedural (Infinite Content)
    // Even split between Math, Series, Visual
    const procRand = Math.random();
    if (procRand < 0.33) return generateMath(lang);
    if (procRand < 0.66) return generateSeries(lang);
    return generateVisual(lang);
}

/**
 * --- MULTILINGUAL DICTIONARY ---
 */
const STRINGS = {
    es: {
        calc: "Cálculo",
        seq: "Serie",
        vis: "Visual",
        alg: "Álgebra",
        spat: "Espacial",
        cnt: "Conteo",
        time: "Tiempo",
        odd: "Intruso",
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
        alg: "Àlgebra",
        spat: "Espacial",
        cnt: "Compte",
        time: "Temps",
        odd: "Intrús",
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
        alg: "Álgebra",
        spat: "Espacial",
        cnt: "Conta",
        time: "Tempo",
        odd: "Intruso",
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
        alg: "Aljebra",
        spat: "Espaziala",
        cnt: "Zenbatzea",
        time: "Denbora",
        odd: "Arrotz",
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
        alg: "Algèbra",
        spat: "Espaciau",
        cnt: "Compde",
        time: "Temps",
        odd: "Intrús",
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
import { getTranslation } from './translations';

// --- 1. STATIC LIBRARY (Handcrafted) ---
export const staticChallenges = [
    { id: "r1_es", lang: "es", type: "riddle", difficulty: 1, question: "¿Qué sube pero nunca baja?", answer: "La edad", explanation: "El tiempo solo avanza.", tags: ["clasica"] },
    { id: "r1_cat", lang: "cat", type: "riddle", difficulty: 1, question: "Què puja però mai baixa?", answer: "L'edat", explanation: "El temps només avança.", tags: ["clàssica"] },
    { id: "r1_gal", lang: "gal", type: "riddle", difficulty: 1, question: "Que sobe pero nunca baixa?", answer: "A idade", explanation: "O tempo só avanza.", tags: ["clásica"] },
    { id: "r1_eus", lang: "eus", type: "riddle", difficulty: 1, question: "Zer igotzen da baina inoiz ez da jaisten?", answer: "Adina", explanation: "Denbora aurrera doa.", tags: ["klasikoa"] },
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
        type: s.calc,
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
        type: s.seq,
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
        type: s.vis,
        difficulty: 1,
        question: p.q,
        options: [e1, e2],
        answer: p.a,
        explanation: p.exp,
        tags: s.tags_visual
    };
}

// --- NEW GENERATORS ---

function generateEmojiAlgebra(lang) {
    const s = getStrings(lang);
    const t = getTranslation(lang);
    const emojis = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓'];
    const [e1, e2] = emojis.sort(() => 0.5 - Math.random()).slice(0, 2);

    // Simple system: 2x = A, x + y = B. Find y?
    const val1 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const val2 = Math.floor(Math.random() * 5) + 1; // 1 to 5

    const sum1 = val1 * 2;
    const sum2 = val1 + val2;

    // Question: 🍎 + 🍎 = 10. 🍎 + 🍌 = 8. 🍌 = ?
    const q = `${e1} + ${e1} = ${sum1} \n ${e1} + ${e2} = ${sum2} \n ${e2} = ?`;

    const options = new Set([val2]);
    while (options.size < 4) {
        options.add(val2 + Math.floor(Math.random() * 5) + 1 - 2);
    }

    return {
        id: `alg_${Date.now()}_${Math.random()}`,
        type: s.alg,
        difficulty: 2,
        question: q,
        options: Array.from(options).filter(n => n > 0).sort((a, b) => a - b).map(String),
        answer: val2.toString(),
        explanation: `${e1}=${val1}, ${e2}=${val2}.`,
        tags: s.tags_logic
    };
}

function generateCounting(lang) {
    const s = getStrings(lang);
    const t = getTranslation(lang);
    const emojis = ['🦁', '🐯', '🐻', '🐨', '🐼', '🐸'];
    const target = emojis[Math.floor(Math.random() * emojis.length)];
    const distractors = emojis.filter(e => e !== target).slice(0, 2);

    const count = Math.floor(Math.random() * 5) + 3; // 3 to 7
    let grid = Array(count).fill(target);

    // Add noise
    const noiseCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < noiseCount; i++) {
        grid.push(distractors[Math.floor(Math.random() * distractors.length)]);
    }

    grid = grid.sort(() => 0.5 - Math.random());

    // Split into 3 lines for display
    const q = `${grid.join(' ')}\n\n${t.counting_q} ${target}`;

    return {
        id: `cnt_${Date.now()}_${Math.random()}`,
        type: s.cnt,
        difficulty: 1,
        question: q,
        options: [count - 1, count, count + 1, count + 2].map(String),
        answer: count.toString(),
        explanation: t.counting_exp,
        tags: s.tags_visual
    };
}

function generateSpatial(lang) {
    const s = getStrings(lang);
    const t = getTranslation(lang);
    const dirs = ['⬆️', '➡️', '⬇️', '⬅️']; // N, E, S, W
    const turns = ['↻', '↺']; // Right, Left

    let currentDirIdx = 0; // Start North
    const steps = [];

    for (let i = 0; i < 2; i++) {
        const turn = turns[Math.floor(Math.random() * turns.length)];
        steps.push(turn);
        if (turn === '↻') currentDirIdx = (currentDirIdx + 1) % 4;
        else currentDirIdx = (currentDirIdx - 1 + 4) % 4;
    }

    // Question: ⬆️ + ↻ + ↻ = ?
    const q = `${dirs[0]} ... ${steps.join(' ')} ... ?`;

    return {
        id: `spat_${Date.now()}_${Math.random()}`,
        type: s.spat,
        difficulty: 2,
        question: q,
        options: dirs,
        answer: dirs[currentDirIdx],
        explanation: t.spatial_exp,
        tags: s.tags_logic
    };
}

function generateOddOneOut(lang) {
    const s = getStrings(lang);
    const t = getTranslation(lang);

    const sets = [
        { category: 'fruit', items: ['🍎', '🍌', '🍇', '🍒'], outlier: '🚗' },
        { category: 'vehicle', items: ['🚗', '🚌', '✈️', '🚓'], outlier: '🐶' },
        { category: 'animal', items: ['🐶', '🐱', '🦁', '🐰'], outlier: '⚽' },
        { category: 'sport', items: ['⚽', '🏀', '🎾', '🏈'], outlier: '🍕' }
    ];

    const set = sets[Math.floor(Math.random() * sets.length)];
    const standard = set.items.sort(() => 0.5 - Math.random()).slice(0, 3);
    const finalSet = [...standard, set.outlier].sort(() => 0.5 - Math.random());

    return {
        id: `odd_${Date.now()}_${Math.random()}`,
        type: s.odd,
        difficulty: 1,
        question: `${finalSet.join(' ')}`,
        options: finalSet,
        answer: set.outlier,
        explanation: t.odd_one_exp,
        tags: s.tags_visual
    };
}

function generateTime(lang) {
    const s = getStrings(lang);
    const t = getTranslation(lang);

    // Simple Days math
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Simplified for MVP, ideally localized names but let's stick to simple logic or numbers
    // Let's do 24h clock math instead to be language neutral-ish

    const startHour = Math.floor(Math.random() * 12) + 1;
    const addHours = Math.floor(Math.random() * 5) + 1;

    const q = `${startHour}:00 + ${addHours}h = ?`;
    const ans = (startHour + addHours) % 12 || 12;

    const options = new Set([ans]);
    while (options.size < 4) {
        let fake = (ans + Math.floor(Math.random() * 3) + 1) % 12 || 12;
        options.add(fake);
    }

    return {
        id: `time_${Date.now()}_${Math.random()}`,
        type: s.time,
        difficulty: 1,
        question: q,
        options: Array.from(options).sort((a, b) => a - b).map(x => `${x}:00`),
        answer: `${ans}:00`,
        explanation: t.time_exp,
        tags: s.tags_logic
    };
}

// --- MASTER GENERATOR ---
export function getChallenge(lang = 'es') {
    const rand = Math.random();

    // 10% Chance: Static Library (Reduced from 20%)
    if (rand < 0.1) {
        const langPool = staticChallenges.filter(c => c.lang === lang);
        if (langPool.length > 0) {
            return langPool[Math.floor(Math.random() * langPool.length)];
        }
    }

    // 90% Chance: Infinite Procedural Content (Uniform Distribution)
    const generators = [
        generateMath,
        generateSeries,
        generateVisual,
        generateEmojiAlgebra,
        generateCounting,
        generateSpatial,
        generateOddOneOut,
        generateTime
    ];

    const selectedGen = generators[Math.floor(Math.random() * generators.length)];
    return selectedGen(lang);
}

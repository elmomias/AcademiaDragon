window.DragonApp = window.DragonApp || {};

(function () {
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function phase(questionNumber) {
        const q = Math.min(20, Math.max(1, Number(questionNumber) || 1));
        const advanced = q > 10;
        return {
            advanced,
            progress: advanced ? (q - 11) / 9 : (q - 1) / 9
        };
    }
    function difficultyNumber(questionNumber, easyMin, easyMax, advancedMin, advancedMax) {
        const level = phase(questionNumber);
        const min = level.advanced ? advancedMin : easyMin;
        const maxStart = level.advanced ? advancedMin : easyMin;
        const maxEnd = level.advanced ? advancedMax : easyMax;
        const upper = Math.round(maxStart + (maxEnd - maxStart) * level.progress);
        return rand(min, Math.max(min, upper));
    }
    const shuffle = values => [...values].sort(() => Math.random() - 0.5);
    const answerOptions = answer => shuffle([answer, answer + 10, Math.max(0, answer - 10)].filter((v, i, a) => a.indexOf(v) === i));
    const doubleHistory = [];

    function selectDoubleBase(level) {
        const pool = level.advanced
            ? Array.from({ length: 38 }, (_, index) => index + 12)
            : Array.from({ length: 10 }, (_, index) => index + 1);
        const poolSet = new Set(pool);
        const relevantHistory = doubleHistory.filter(value => poolSet.has(value));

        let available = pool.filter(value => !relevantHistory.includes(value));
        if (!available.length) {
            doubleHistory.length = 0;
            available = pool.slice();
        }

        if (relevantHistory.length >= 2) {
            const lastThree = doubleHistory.slice(-3);
            if (lastThree.length === 3
                && lastThree[0] === lastThree[1]
                && lastThree[1] === lastThree[2]) {
                available = available.filter(value => value !== lastThree[0]);
            }
        }

        if (!available.length) available = pool.slice();
        const selected = available[rand(0, available.length - 1)];
        doubleHistory.push(selected);
        return selected;
    }

    function rememberChallenge(questionNumber) {
        if (questionNumber % 2 === 1) {
            const pairs = rand(2, 3);
            const values = Array.from({ length: pairs }, () => {
                const first = rand(1, 9);
                return [first, 10 - first];
            }).flat();
            const total = values.reduce((sum, value) => sum + value, 0);
            return {
                prompt: 'Agrupa las piedras de los sacos formando parejas de 10. ¿Cuántas piedras hay en total?',
                answer: total,
                paso1: `Busca parejas entre los sacos que sumen 10. Puedes formar ${pairs} parejas.`,
                paso2: `${pairs} decenas son ${total} piedras.`,
                visual: {
                    type: 'sacks',
                    values
                }
            };
        }

        const start = rand(1, 8) * 10 + rand(1, 4);
        const jumps = [rand(1, 2) * 10, rand(1, 2) * 10, rand(1, 9)];
        const total = start + jumps.reduce((sum, jump) => sum + jump, 0);
        return {
            prompt: 'Avanza por la recta con los saltos indicados. ¿A qué número llegas?',
            answer: total,
            paso1: `Empieza en ${start} y suma los saltos de izquierda a derecha.`,
            paso2: `${start} ${jumps.map(jump => `+ ${jump}`).join(' ')} = ${total}.`,
            visual: {
                type: 'number-line',
                start,
                jumps
            }
        };
    }

    function generateByStrategy(strategyId, options = {}) {
        const questionNumber = Math.min(20, Math.max(1, Number(options.questionNumber) || 1));
        const level = phase(questionNumber);
        switch (Number(strategyId)) {
            case 1: {
                const variant = level.advanced ? rand(3, 6) : rand(1, 2);
                if (variant <= 2) {
                    const known = rand(1, 9);
                    const answer = 10 - known;
                    return {
                        strategyId: 1,
                        prompt: variant === 1 ? `${known} + ? = 10` : `? + ${known} = 10`,
                        answer,
                        options: null,
                        paso1: `Buscamos el amigo del ${known}.`,
                        paso2: `${known} + ${answer} = 10.`
                    };
                }
                if (variant === 6) {
                    const a = rand(6, 9);
                    const firstPart = 10 - a;
                    const remainder = rand(1, 9 - firstPart);
                    const b = firstPart + remainder;
                    return {
                        strategyId: 1,
                        prompt: `${a} + ${b} = ${a} + ${firstPart} + ?`,
                        answer: remainder,
                        options: null,
                        paso1: `Partimos ${b} en ${firstPart} y ${remainder}.`,
                        paso2: `${a} + ${firstPart} = 10; aún quedan ${remainder}.`
                    };
                }
                const a = rand(1, 5);
                const b = rand(1, 8 - a);
                const answer = 10 - a - b;
                const prompts = [
                    `${a} + ${b} + ? = 10`,
                    `${a} + ? + ${b} = 10`,
                    `? + ${a} + ${b} = 10`
                ];
                return {
                    strategyId: 1,
                    prompt: prompts[variant - 3],
                    answer,
                    options: null,
                    paso1: `Los sumandos conocidos forman ${a + b}.`,
                    paso2: `De ${a + b} hasta 10 faltan ${answer}.`
                };
            }
            case 2: {
                const tens = difficultyNumber(questionNumber, 1, 3, 4, 9) * 10;
                const units = difficultyNumber(questionNumber, 1, 4, 5, 9);
                const a = tens + units;
                const toTen = 10 - units;
                const b = rand(toTen + 1, level.advanced ? 18 : 9);
                const remainder = b - toTen;
                const total = a + b;
                const nextTen = tens + 10;
                const variant = level.advanced ? rand(2, 3) : 1;
                const prompt = variant === 1 ? `${a} + ${b}` : variant === 2 ? `${a} + ${b} = ${nextTen} + ?` : `${a} + ? = ${total}`;
                return {
                    strategyId: 2,
                    prompt,
                    answer: variant === 1 ? total : variant === 2 ? remainder : b,
                    options: null,
                    paso1: `Completamos la decena: ${a} + ${toTen} = ${nextTen}.`,
                    paso2: `Añadimos los ${remainder} restantes: ${nextTen} + ${remainder} = ${total}.`
                };
            }
            case 3: {
                const n = selectDoubleBase(level);
                const double = n * 2;
                const variant = level.advanced && double >= 20 ? rand(1, 2) : 1;
                if (variant === 2) {
                    const tens = Math.floor(double / 10);
                    const units = double % 10;
                    return {
                        strategyId: 3,
                        doubleBase: n,
                        prompt: `${n} + ${n} = ${tens}□`,
                        answer: units,
                        options: null,
                        paso1: `Calculamos el doble de ${n}: ${n} + ${n} = ${double}.`,
                        paso2: `La cifra de las decenas es ${tens}; falta escribir las unidades: ${units}.`
                    };
                }
                return {
                    strategyId: 3,
                    doubleBase: n,
                    prompt: `${n} + ${n}`,
                    answer: double,
                    options: null,
                    paso1: `Calculamos el doble de ${n}.`,
                    paso2: `${n} + ${n} = ${double}.`
                };
            }
            case 4: {
                const tens = difficultyNumber(questionNumber, 1, 3, 4, 9) * 10;
                const units = difficultyNumber(questionNumber, 1, 4, 5, 7);
                const minuend = tens + units;
                const subtrahend = rand(units + 1, level.advanced ? 18 : Math.min(9, units + 4));
                const remainder = subtrahend - units;
                const result = minuend - subtrahend;
                const variant = level.advanced ? rand(2, 3) : 1;
                return {
                    strategyId: 4,
                    prompt: variant === 1 ? `${minuend} - ${subtrahend}` : variant === 2 ? `${minuend} - ${subtrahend} = ${tens} - ?` : `${minuend} - ? = ${result}`,
                    answer: variant === 1 ? result : variant === 2 ? remainder : subtrahend,
                    options: null,
                    paso1: `Bajamos a la decena: ${minuend} - ${units} = ${tens}.`,
                    paso2: `Después quitamos ${remainder}: ${tens} - ${remainder} = ${result}.`
                };
            }
            case 5: {
                const n = difficultyNumber(questionNumber, 1, 5, 6, 49);
                const next = n + 1;
                const double = n * 2;
                const total = double + 1;
                const variant = level.advanced ? rand(2, 3) : 1;
                const firstBig = Math.random() < 0.5;
                return {
                    strategyId: 5,
                    prompt: variant === 3 ? `${n} + ? = ${total}` : firstBig ? `${next} + ${n}` : `${n} + ${next}`,
                    answer: variant === 3 ? next : total,
                    options: null,
                    paso1: `Usamos el doble: ${n} + ${n} = ${double}.`,
                    paso2: `Añadimos 1: ${double} + 1 = ${total}.`
                };
            }
            case 6: {
                const n = difficultyNumber(questionNumber, 1, 20, 40, 189);
                const add = level.advanced ? Math.random() < 0.6 : true;
                const bridge = level.advanced && rand(1, 3) === 3;
                if (add) {
                    return { strategyId: 6, prompt: bridge ? `${n} + 9 = ${n + 10} - ?` : `${n} + 9`, answer: bridge ? 1 : n + 9, options: null, paso1: `${n} + 10 = ${n + 10}.`, paso2: `${n + 10} - 1 = ${n + 9}.` };
                }
                return { strategyId: 6, prompt: bridge ? `${n} - 9 = ${n - 10} + ?` : `${n} - 9`, answer: bridge ? 1 : n - 9, options: null, paso1: `${n} - 10 = ${n - 10}.`, paso2: `${n - 10} + 1 = ${n - 9}.` };
            }
            case 7: {
                const n = difficultyNumber(questionNumber, 1, 20, 40, 189);
                const add = level.advanced ? Math.random() < 0.6 : true;
                const bridge = level.advanced && rand(1, 3) === 3;
                return {
                    strategyId: 7,
                    prompt: add
                        ? bridge ? `${n} + 11 = ${n + 10} + ?` : `${n} + 11`
                        : bridge ? `${n} - 11 = ${n - 10} - ?` : `${n} - 11`,
                    answer: bridge ? 1 : add ? n + 11 : n - 11,
                    options: null,
                    paso1: add ? `${n} + 10 = ${n + 10}.` : `${n} - 10 = ${n - 10}.`,
                    paso2: add ? `${n + 10} + 1 = ${n + 11}.` : `${n - 10} - 1 = ${n - 11}.`
                };
            }
            case 8: {
                const variant = level.advanced ? rand(2, 4) : 1;
                if (variant <= 2) {
                    const a = difficultyNumber(questionNumber, 1, 5, 6, 9) * 10;
                    if (variant === 2) {
                        const b = rand(12, 88);
                        const answer = 100 - b;
                        return { strategyId: 8, prompt: `${b} + ? = 100`, answer, options: null, paso1: `Buscamos el complemento de ${b}.`, paso2: `${b} + ${answer} = 100.` };
                    }
                    return { strategyId: 8, prompt: `${a} + ? = 100`, answer: 100 - a, options: null, paso1: `Contamos las decenas que faltan.`, paso2: `${a} + ${100 - a} = 100.` };
                }
                const a = rand(1, 5) * 10;
                const b = rand(11, 39);
                const answer = 100 - a - b;
                return { strategyId: 8, prompt: variant === 3 ? `${a} + ${b} + ? = 100` : `? + ${a} + ${b} = 100`, answer, options: null, paso1: `Agrupamos: ${a} + ${b} = ${a + b}.`, paso2: `Hasta 100 faltan ${answer}.` };
            }
            case 9: {
                let n = difficultyNumber(questionNumber, 11, 49, 50, 999);
                while (n % 10 === 0 || n % 10 === 5) {
                    n = difficultyNumber(questionNumber, 11, 49, 50, 999);
                }
                const answer = Math.round(n / 10) * 10;
                const choices = shuffle([answer, answer - 10, answer + 10].filter(v => v >= 0));
                return { strategyId: 9, prompt: `Aproxima ${n} a la decena más cercana.`, answer, options: choices, paso1: `Observa las unidades de ${n}.`, paso2: `${n} está más cerca de ${answer}.` };
            }
            case 10: {
                const aTens = difficultyNumber(questionNumber, 1, 3, 4, 12);
                const aUnits = difficultyNumber(questionNumber, 1, 4, 5, 9);
                const bTens = difficultyNumber(questionNumber, 1, 2, 2, 9);
                const bUnits = level.advanced
                    ? rand(11 - aUnits, 9)
                    : rand(0, 9 - aUnits);
                const a = aTens * 10 + aUnits;
                const b = bTens * 10 + bUnits;
                const answer = a + b;
                return { strategyId: 10, prompt: `${a} + ${b}`, answer, options: answerOptions(answer), paso1: `${aUnits} + ${bUnits} = ${aUnits + bUnits}.`, paso2: `Sumando decenas y unidades obtenemos ${answer}.` };
            }
            case 11: {
                const tens = difficultyNumber(questionNumber, 2, 4, 5, 19);
                const units = difficultyNumber(questionNumber, 0, 2, 0, 3);
                const subTens = rand(1, tens - 1);
                const subUnits = rand(units + 2, 9);
                const a = tens * 10 + units;
                const b = subTens * 10 + subUnits;
                const answer = a - b;
                return { strategyId: 11, prompt: `${a} - ${b}`, answer, options: answerOptions(answer), paso1: `Pedimos una decena: ${units + 10} - ${subUnits} = ${units + 10 - subUnits}.`, paso2: `La resta completa es ${answer}.` };
            }
            case 12: {
                const base = difficultyNumber(questionNumber, 2, 9, 10, 99);
                const factor = level.advanced
                    ? [100, 1000][rand(0, 1)]
                    : 10;
                return { strategyId: 12, prompt: `${base} × ${factor}`, answer: base * factor, options: shuffle([base * factor, base * factor * 10, base * (factor / 10)]), paso1: `Multiplicamos ${base} por 1.`, paso2: `Añadimos los ceros de ${factor}: ${base * factor}.` };
            }
            case 101: {
                const hundreds = difficultyNumber(questionNumber, 1, 3, 4, 9);
                const tens = difficultyNumber(questionNumber, 0, 4, 5, 9);
                const units = difficultyNumber(questionNumber, 0, 4, 5, 9);
                const total = hundreds * 100 + tens * 10 + units;
                const answer = `${hundreds}C + ${tens}D + ${units}U`;
                return { strategyId: 101, prompt: `Descompón ${total} en centenas, decenas y unidades.`, answer, options: shuffle([answer, `${tens}C + ${hundreds}D + ${units}U`, `${hundreds}C + ${units}D + ${tens}U`]), paso1: `${total} tiene ${hundreds} centenas, ${tens} decenas y ${units} unidades.`, paso2: `${total} = ${hundreds * 100} + ${tens * 10} + ${units}.` };
            }
            case 102: {
                const step = level.advanced ? [3, 4, 6, 7, 9][rand(0, 4)] : [2, 5, 10][rand(0, 2)];
                const start = difficultyNumber(questionNumber, 1, 5, 6, 30) * step;
                return { strategyId: 102, prompt: `Completa: ${start}, ${start + step}, ${start + step * 2}, ?`, answer: start + step * 3, options: null, paso1: `La serie aumenta de ${step} en ${step}.`, paso2: `${start + step * 2} + ${step} = ${start + step * 3}.` };
            }
            case 13: {
                const thousands = difficultyNumber(questionNumber, 1, 3, 4, 9);
                const hundreds = difficultyNumber(questionNumber, 0, 2, 3, 9);
                const tens = difficultyNumber(questionNumber, 0, 3, 4, 9);
                const units = difficultyNumber(questionNumber, 0, 3, 4, 9);
                const number = thousands * 1000 + hundreds * 100 + tens * 10 + units;
                const variant = level.advanced ? rand(3, 4) : rand(1, 2);
                if (variant === 1) {
                    const answer = Math.round(number / 100) * 100;
                    return { strategyId: 13, prompt: `Redondea ${number} a la centena más cercana.`, answer, options: shuffle([answer, answer - 100, answer + 100].filter(value => value >= 0)), paso1: `Observamos las decenas y unidades de ${number}.`, paso2: `${number} se aproxima a ${answer}.` };
                }
                if (variant === 2) {
                    const answer = number;
                    return { strategyId: 13, prompt: `Descompón ${number} en UM, C, D y U.`, answer: `${thousands}UM + ${hundreds}C + ${tens}D + ${units}U`, options: null, paso1: `La cifra ${thousands} ocupa las unidades de millar.`, paso2: `${number} = ${thousands * 1000} + ${hundreds * 100} + ${tens * 10} + ${units}.` };
                }
                if (variant === 3) {
                    const lower = number - rand(1, Math.min(500, number));
                    const answer = lower < number ? '>' : '<';
                    return { strategyId: 13, prompt: `Compara: ${lower} ? ${number}. ¿Qué signo completa la relación: <, = o >?`, answer, options: ['<', '=', '>'], paso1: `Comparamos primero las unidades de millar.`, paso2: `${lower} es menor que ${number}, por eso usamos el signo ${answer}.` };
                }
                const step = rand(10, 90);
                const answer = number + step;
                return { strategyId: 13, prompt: `Completa la serie: ${number}, ${number + step}, ${number + step * 2}, ?`, answer: number + step * 3, options: null, paso1: `La serie avanza de ${step} en ${step}.`, paso2: `${number + step * 2} + ${step} = ${number + step * 3}.` };
            }
            case 14: {
                const variant = level.advanced ? rand(1, 3) : 1;
                if (variant === 1) {
                    const a = difficultyNumber(questionNumber, 1000, 2500, 3200, 7800);
                    const b = Math.min(
                        difficultyNumber(questionNumber, 100, 900, 1100, 4500),
                        9999 - a
                    );
                    const answer = a + b;
                    return { strategyId: 14, prompt: `${a} + ${b}`, answer, options: answerOptions(answer), paso1: `Sumamos primero unidades y decenas, después centenas y millares.`, paso2: `La suma completa es ${answer}.` };
                }
                if (variant === 2) {
                    const a = rand(3000, 8900);
                    const b = rand(1000, a - 500);
                    const answer = a - b;
                    return { strategyId: 14, prompt: `${a} - ${b}`, answer, options: answerOptions(answer), paso1: `Restamos las unidades, decenas, centenas y unidades de millar.`, paso2: `La diferencia es ${answer}.` };
                }
                const total = rand(2500, 8000);
                const known = rand(500, total - 500);
                const answer = total - known;
                return { strategyId: 14, prompt: `${known} + ? = ${total}`, answer, options: null, paso1: `Restamos la parte conocida al resultado.`, paso2: `${total} - ${known} = ${answer}.` };
            }
            case 15: {
                const variant = level.advanced ? rand(3, 4) : rand(1, 2);
                if (variant === 1) {
                    const angle = rand(1, 179);
                    const answer = angle === 90 ? 'recto' : angle < 90 ? 'agudo' : 'obtuso';
                    return { strategyId: 15, prompt: `Un ángulo mide ${angle}°. ¿Es agudo, recto u obtuso?`, answer, options: ['agudo', 'recto', 'obtuso'], paso1: `Un recto mide 90°, uno agudo menos de 90° y uno obtuso más de 90°.`, paso2: `${angle}° corresponde a un ángulo ${answer}.` };
                }
                if (variant === 2) {
                    return { strategyId: 15, prompt: '¿Cómo son entre sí dos rectas que nunca se cruzan?', answer: 'paralelas', options: ['paralelas', 'perpendiculares', 'secantes'], paso1: 'Las rectas paralelas mantienen siempre la misma distancia.', paso2: 'Nunca se cruzan: son rectas paralelas.' };
                }
                if (variant === 3) {
                    return { strategyId: 15, prompt: '¿Cómo se llaman dos rectas que se cruzan formando cuatro ángulos rectos?', answer: 'perpendiculares', options: ['paralelas', 'perpendiculares', 'curvas'], paso1: 'Los ángulos rectos miden 90°.', paso2: 'Dos rectas que forman ángulos rectos son perpendiculares.' };
                }
                const answer = '4';
                return { strategyId: 15, prompt: `¿Cuántos ángulos rectos forman dos rectas perpendiculares? Escribe solo el número.`, answer, options: null, paso1: 'Las perpendiculares se cruzan formando cuatro regiones iguales.', paso2: 'Forman 4 ángulos rectos.' };
            }
            case 16: {
                const factor = level.advanced ? difficultyNumber(questionNumber, 2, 5, 6, 12) : rand(2, 5);
                const times = level.advanced ? difficultyNumber(questionNumber, 2, 5, 6, 12) : rand(2, 5);
                const variant = level.advanced ? rand(2, 3) : 1;
                if (variant === 1) {
                    const answer = factor * times;
                    return { strategyId: 16, prompt: `${factor} × ${times}`, answer, options: answerOptions(answer), paso1: `Es una suma de ${times} grupos de ${factor}.`, paso2: `${factor} × ${times} = ${answer}.` };
                }
                if (variant === 2) {
                    const answer = factor;
                    const product = factor * times;
                    return { strategyId: 16, prompt: `Escribe el factor que falta: ${answer} × ${times} = ${product}.`, answer, options: null, paso1: `Busca el número que multiplicado por ${times} da ${product}.`, paso2: `${answer} × ${times} = ${product}.` };
                }
                const answer = Array(times).fill(factor).join(' + ');
                return { strategyId: 16, prompt: `Transforma esta suma en multiplicación: ${answer}`, answer: `${times} × ${factor}`, options: shuffle([`${times} × ${factor}`, `${factor} × ${times + 1}`, `${times + 1} × ${factor}`]), paso1: `El número ${factor} aparece ${times} veces.`, paso2: `${answer} = ${times} × ${factor}.` };
            }
            case 301: {
                const base = difficultyNumber(questionNumber, 10, 90, 900, 990);
                const ordinal = difficultyNumber(questionNumber, 1, 10, 11, 20);
                if (level.advanced && questionNumber % 2 === 0) {
                    const answer = ordinal - 1;
                    return {
                        strategyId: 301,
                        prompt: `En la carrera del dragón, ${ordinal}.º va detrás de un participante. ¿En qué lugar va ese participante?`,
                        answer,
                        paso1: 'El puesto anterior es el número ordinal justo antes.',
                        paso2: `Antes de ${ordinal}.º está ${answer}.º.`
                    };
                }
                const jump = rand(2, 9);
                const answer = base + jump;
                return {
                    strategyId: 301,
                    prompt: `El dragón ha contado ${base} pasos y avanza ${jump} más. ¿Por qué número va?`,
                    answer,
                    paso1: `Continúa contando desde ${base}.`,
                    paso2: `${base} + ${jump} = ${answer}.`
                };
            }
            case 302: {
                const hundreds = difficultyNumber(questionNumber, 1, 3, 4, 9);
                const tens = difficultyNumber(questionNumber, 0, 3, 4, 9);
                const units = difficultyNumber(questionNumber, 0, 4, 5, 9);
                const number = hundreds * 100 + tens * 10 + units;
                if (level.advanced && questionNumber % 3 === 0) {
                    const answer = Math.round(number / 10) * 10;
                    return {
                        strategyId: 302,
                        prompt: `La forja debe redondear ${number} a la decena más cercana. ¿Qué muestra el sello?`,
                        answer,
                        paso1: 'Si las unidades son 0 a 4 baja; si son 5 a 9 sube.',
                        paso2: `${number} se redondea a ${answer}.`
                    };
                }
                if (!level.advanced || questionNumber % 3 === 1) {
                    const answer = hundreds;
                    return {
                        strategyId: 302,
                        prompt: `En ${number}, ¿cuántas centenas hay?`,
                        answer,
                        paso1: 'La cifra de la izquierda indica las centenas.',
                        paso2: `${number} tiene ${hundreds} C, ${tens} D y ${units} U.`
                    };
                }
                const answer = hundreds * 100 + tens * 10;
                return {
                    strategyId: 302,
                    prompt: `Separa ${number}: ¿cuánto valen juntas sus centenas y decenas?`,
                    answer,
                    paso1: `Convierte las centenas: ${hundreds} C = ${hundreds * 100}. Convierte las decenas: ${tens} D = ${tens * 10}.`,
                    paso2: `${hundreds * 100} + ${tens * 10} = ${answer}.`
                };
            }
            case 303: {
                if (level.advanced && questionNumber % 3 === 0) {
                    const hundreds = rand(2, 9);
                    const tens = rand(1, 9);
                    const units = rand(0, 3);
                    const subUnits = rand(units + 2, 9);
                    const subHundreds = rand(1, hundreds - 1);
                    const minuend = hundreds * 100 + tens * 10 + units;
                    const subtrahend = subHundreds * 100 + rand(0, tens - 1) * 10 + subUnits;
                    const answer = minuend - subtrahend;
                    return {
                        strategyId: 303,
                        prompt: `Una poción tenía ${minuend} gotas. Se usaron ${subtrahend}. ¿Cuántas quedan?`,
                        answer,
                        paso1: `Como ${units} unidades no alcanzan para quitar ${subUnits}, haz un canje de una decena.`,
                        paso2: `${minuend} - ${subtrahend} = ${answer}.`
                    };
                }
                const a = difficultyNumber(questionNumber, 10, 30, 120, 399);
                const b = difficultyNumber(questionNumber, 1, 20, 80, 299);
                const c = difficultyNumber(questionNumber, 1, 9, 10, 99);
                const answer = a + b + c;
                return {
                    strategyId: 303,
                    prompt: `Junta tres pociones con ${a}, ${b} y ${c} gotas. ¿Cuántas gotas hay?`,
                    answer,
                    paso1: `Agrupa primero ${a} + ${b}; también puedes cambiar el orden sin alterar el total.`,
                    paso2: `${a} + ${b} + ${c} = ${answer}.`
                };
            }
            case 304: {
                const easySteps = [2, 5, 10];
                const advancedSteps = [3, 4, 25, 50, 100];
                const step = (level.advanced ? advancedSteps : easySteps)[rand(0, (level.advanced ? advancedSteps : easySteps).length - 1)];
                if (level.advanced && questionNumber % 3 === 0) {
                    const times = rand(4, 9);
                    const group = rand(6, 12);
                    const answer = group * times;
                    return {
                        strategyId: 304,
                        prompt: `Hay ${times} cofres con ${group} gemas cada uno. ¿Cuántas gemas hay en total?`,
                        answer,
                        paso1: `Son ${times} sumandos iguales de ${group}.`,
                        paso2: `${Array(times).fill(group).join(' + ')} = ${answer}.`
                    };
                }
                if (!level.advanced || questionNumber % 3 === 1) {
                    const start = questionNumber % 2 === 0 ? 0 : 5;
                    const answer = start + step * 3;
                    return {
                        strategyId: 304,
                        prompt: `Completa el mapa: ${start}, ${start + step}, ${start + step * 2}, ?`,
                        answer,
                        paso1: `La cadencia avanza de ${step} en ${step}.`,
                        paso2: `${start + step * 2} + ${step} = ${answer}.`
                    };
                }
                const total = difficultyNumber(questionNumber, 10, 40, 100, 300);
                const part = rand(5, total - 5);
                const answer = total - part;
                return {
                    strategyId: 304,
                    prompt: `El mapa muestra ${part} + ? = ${total}. ¿Qué camino falta?`,
                    answer,
                    paso1: 'Suma y resta están relacionadas; resta la parte conocida al total.',
                    paso2: `${total} - ${part} = ${answer}.`
                };
            }
            case 200: {
                const exercise = rememberChallenge(questionNumber);
                return {
                    strategyId: 200,
                    prompt: exercise.prompt,
                    answer: exercise.answer,
                    options: null,
                    paso1: exercise.paso1,
                    paso2: exercise.paso2,
                    visual: exercise.visual,
                    activityType: 'visual'
                };
            }
            default:
                return {
                    strategyId: 301,
                    prompt: 'El dragón cuenta 998 pasos y avanza uno. ¿Por qué número va?',
                    answer: 999,
                    paso1: 'Para contar un paso más, suma 1.',
                    paso2: '998 + 1 = 999.'
                };
        }
    }

    window.DragonApp.GeneratorMath = { generateByStrategy };
})();

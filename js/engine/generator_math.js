window.DragonApp = window.DragonApp || {};

(function () {
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffle = values => [...values].sort(() => Math.random() - 0.5);
    const options = answer => shuffle([answer, answer + 10, Math.max(0, answer - 10)].filter((v, i, a) => a.indexOf(v) === i));

    function generateByStrategy(strategyId) {
        switch (Number(strategyId)) {
            case 1: {
                const variant = rand(1, 6);
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
                const tens = rand(2, 8) * 10;
                const units = rand(3, 9);
                const a = tens + units;
                const toTen = 10 - units;
                const b = rand(toTen + 1, 9);
                const remainder = b - toTen;
                const total = a + b;
                const nextTen = tens + 10;
                const variant = rand(1, 3);
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
                const pool = [6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 24, 25, 26, 35, 45];
                const n = pool[rand(0, pool.length - 1)];
                const double = n * 2;
                const variant = rand(1, 3);
                return {
                    strategyId: 3,
                    prompt: variant === 1 ? `${n} + ${n}` : variant === 2 ? `? + ? = ${double}` : `${n} + ? = ${double}`,
                    answer: variant === 1 ? double : n,
                    options: null,
                    paso1: variant === 2 ? `${double} es el doble de ${n}.` : `Calculamos el doble de ${n}.`,
                    paso2: `${n} + ${n} = ${double}.`
                };
            }
            case 4: {
                const tens = rand(3, 9) * 10;
                const units = rand(1, 7);
                const minuend = tens + units;
                const subtrahend = rand(units + 1, 9);
                const remainder = subtrahend - units;
                const result = minuend - subtrahend;
                const variant = rand(1, 3);
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
                const n = rand(6, 25);
                const next = n + 1;
                const double = n * 2;
                const total = double + 1;
                const variant = rand(1, 3);
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
                const n = rand(14, 88);
                const add = Math.random() < 0.6;
                const bridge = rand(1, 3) === 3;
                if (add) {
                    return { strategyId: 6, prompt: bridge ? `${n} + 9 = ${n + 10} - ?` : `${n} + 9`, answer: bridge ? 1 : n + 9, options: null, paso1: `${n} + 10 = ${n + 10}.`, paso2: `${n + 10} - 1 = ${n + 9}.` };
                }
                return { strategyId: 6, prompt: bridge ? `${n} - 9 = ${n - 10} + ?` : `${n} - 9`, answer: bridge ? 1 : n - 9, options: null, paso1: `${n} - 10 = ${n - 10}.`, paso2: `${n - 10} + 1 = ${n - 9}.` };
            }
            case 7: {
                const n = rand(15, 85);
                const add = Math.random() < 0.6;
                const bridge = rand(1, 3) === 3;
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
                const variant = rand(1, 4);
                if (variant <= 2) {
                    const a = rand(1, 9) * 10;
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
                let n = rand(11, 98);
                while (n % 10 === 0 || n % 10 === 5) n = rand(11, 98);
                const answer = Math.round(n / 10) * 10;
                const choices = shuffle([answer, answer - 10, answer + 10].filter(v => v >= 0));
                return { strategyId: 9, prompt: `Aproxima ${n} a la decena más cercana.`, answer, options: choices, paso1: `Observa las unidades de ${n}.`, paso2: `${n} está más cerca de ${answer}.` };
            }
            case 10: {
                const aTens = rand(2, 8);
                const aUnits = rand(5, 9);
                const bTens = rand(1, 3);
                const bUnits = rand(11 - aUnits, 9);
                const a = aTens * 10 + aUnits;
                const b = bTens * 10 + bUnits;
                const answer = a + b;
                return { strategyId: 10, prompt: `${a} + ${b}`, answer, options: options(answer), paso1: `${aUnits} + ${bUnits} = ${aUnits + bUnits}.`, paso2: `Sumando decenas y unidades obtenemos ${answer}.` };
            }
            case 11: {
                const tens = rand(3, 9);
                const units = rand(0, 3);
                const subTens = rand(1, tens - 1);
                const subUnits = rand(units + 2, 9);
                const a = tens * 10 + units;
                const b = subTens * 10 + subUnits;
                const answer = a - b;
                return { strategyId: 11, prompt: `${a} - ${b}`, answer, options: options(answer), paso1: `Pedimos una decena: ${units + 10} - ${subUnits} = ${units + 10 - subUnits}.`, paso2: `La resta completa es ${answer}.` };
            }
            case 12: {
                const base = rand(2, 9);
                const factor = [10, 100, 1000][rand(0, 2)];
                return { strategyId: 12, prompt: `${base} × ${factor}`, answer: base * factor, options: shuffle([base * factor, base * factor * 10, base * (factor / 10)]), paso1: `Multiplicamos ${base} por 1.`, paso2: `Añadimos los ceros de ${factor}: ${base * factor}.` };
            }
            case 101: {
                const hundreds = rand(1, 9);
                const tens = rand(0, 9);
                const units = rand(0, 9);
                const total = hundreds * 100 + tens * 10 + units;
                const answer = `${hundreds}C + ${tens}D + ${units}U`;
                return { strategyId: 101, prompt: `Descompón ${total} en centenas, decenas y unidades.`, answer, options: shuffle([answer, `${tens}C + ${hundreds}D + ${units}U`, `${hundreds}C + ${units}D + ${tens}U`]), paso1: `${total} tiene ${hundreds} centenas, ${tens} decenas y ${units} unidades.`, paso2: `${total} = ${hundreds * 100} + ${tens * 10} + ${units}.` };
            }
            case 102: {
                const step = [2, 5, 10][rand(0, 2)];
                const start = rand(1, 5) * step;
                return { strategyId: 102, prompt: `Completa: ${start}, ${start + step}, ${start + step * 2}, ?`, answer: start + step * 3, options: null, paso1: `La serie aumenta de ${step} en ${step}.`, paso2: `${start + step * 2} + ${step} = ${start + step * 3}.` };
            }
            default:
                return generateByStrategy(1);
        }
    }

    window.DragonApp.GeneratorMath = { generateByStrategy };
})();

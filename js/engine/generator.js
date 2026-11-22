window.DragonApp = window.DragonApp || {};

(function () {
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function exercise(strategyId, prompt, answer, paso1, paso2) {
        return { strategyId, prompt, answer, paso1, paso2 };
    }

    function generateByStrategy(strategyId) {
        switch (Number(strategyId)) {
            case 1: {
                const variant = rand(1, 6);

                if (variant <= 2) {
                    const known = rand(1, 9);
                    const answer = 10 - known;
                    const prompt = variant === 1
                        ? `${known} + ? = 10`
                        : `? + ${known} = 10`;
                    return exercise(
                        1,
                        prompt,
                        answer,
                        `Busca el amigo del ${known}: la pareja que completa una decena.`,
                        `${known} + ${answer} = 10. La respuesta es ${answer}.`
                    );
                }

                if (variant === 6) {
                    const first = rand(6, 9);
                    const friend = 10 - first;
                    const remainder = rand(1, 9 - friend);
                    const second = friend + remainder;
                    return exercise(
                        1,
                        `${first} + ${second} = ${first} + ${friend} + ?`,
                        remainder,
                        `Separa ${second} para utilizar primero el amigo de ${first}: ${friend}.`,
                        `${first} + ${friend} = 10 y todavía quedan ${remainder}.`
                    );
                }

                const a = rand(1, 5);
                const b = rand(1, 8 - a);
                const knownTotal = a + b;
                const answer = 10 - knownTotal;
                const prompts = [
                    `${a} + ${b} + ? = 10`,
                    `${a} + ? + ${b} = 10`,
                    `? + ${a} + ${b} = 10`
                ];
                return exercise(
                    1,
                    prompts[variant - 3],
                    answer,
                    `Agrupa los dos números que conoces: ${a} + ${b} = ${knownTotal}.`,
                    `De ${knownTotal} a 10 faltan ${answer}.`
                );
            }

            case 2: {
                const tens = rand(2, 8) * 10;
                const units = rand(3, 9);
                const first = tens + units;
                const toTen = 10 - units;
                const second = rand(toTen + 1, 9);
                const remainder = second - toTen;
                const nextTen = tens + 10;
                const result = first + second;
                const variant = rand(1, 3);
                const prompt = variant === 1
                    ? `${first} + ${second}`
                    : variant === 2
                        ? `${first} + ${second} = ${nextTen} + ?`
                        : `${first} + ? = ${result}`;
                return exercise(
                    2,
                    prompt,
                    variant === 1 ? result : variant === 2 ? remainder : second,
                    `Primero completa la decena: ${first} + ${toTen} = ${nextTen}.`,
                    `Del segundo número quedan ${remainder}; ${nextTen} + ${remainder} = ${result}.`
                );
            }

            case 3: {
                const pool = [6, 7, 8, 9, 12, 13, 14, 15, 16, 18, 24, 25, 35, 45];
                const number = pool[rand(0, pool.length - 1)];
                const double = number * 2;
                const variant = rand(1, 3);
                const prompt = variant === 1
                    ? `${number} + ${number}`
                    : variant === 2
                        ? `? + ? = ${double}`
                        : `${number} + ? = ${double}`;
                return exercise(
                    3,
                    prompt,
                    variant === 1 ? double : number,
                    variant === 2
                        ? `Busca la mitad de ${double}, porque deben aparecer dos cantidades iguales.`
                        : `Calcula el doble de ${number} sumando esa cantidad dos veces.`,
                    `${number} + ${number} = ${double}. La respuesta es ${variant === 1 ? double : number}.`
                );
            }

            case 4: {
                const tens = rand(3, 9) * 10;
                const units = rand(1, 7);
                const minuend = tens + units;
                const subtrahend = rand(units + 1, 9);
                const remainder = subtrahend - units;
                const result = minuend - subtrahend;
                const variant = rand(1, 3);
                const prompt = variant === 1
                    ? `${minuend} - ${subtrahend}`
                    : variant === 2
                        ? `${minuend} - ${subtrahend} = ${tens} - ?`
                        : `${minuend} - ? = ${result}`;
                return exercise(
                    4,
                    prompt,
                    variant === 1 ? result : variant === 2 ? remainder : subtrahend,
                    `Baja primero a la decena: ${minuend} - ${units} = ${tens}.`,
                    `Ahora quita los ${remainder} restantes: ${tens} - ${remainder} = ${result}.`
                );
            }

            case 5: {
                const number = rand(6, 25);
                const next = number + 1;
                const double = number * 2;
                const result = double + 1;
                const variant = rand(1, 3);
                const prompt = variant === 3
                    ? `${number} + ? = ${result}`
                    : Math.random() < 0.5
                        ? `${next} + ${number}`
                        : `${number} + ${next}`;
                return exercise(
                    5,
                    prompt,
                    variant === 3 ? next : result,
                    `Los números ${number} y ${next} son consecutivos. Apóyate en el doble: ${number} + ${number} = ${double}.`,
                    `Añade 1 al doble: ${double} + 1 = ${result}.`
                );
            }

            case 6: {
                const number = rand(14, 88);
                const add = Math.random() < 0.5;
                const bridge = rand(1, 3) === 3;
                const sign = add ? '+' : '-';
                const intermediate = add ? number + 10 : number - 10;
                const result = add ? number + 9 : number - 9;
                const bridgeSign = add ? '-' : '+';
                return exercise(
                    6,
                    bridge ? `${number} ${sign} 9 = ${intermediate} ${bridgeSign} ?` : `${number} ${sign} 9`,
                    bridge ? 1 : result,
                    add
                        ? `Para sumar 9, suma primero 10: ${number} + 10 = ${intermediate}.`
                        : `Para restar 9, resta primero 10: ${number} - 10 = ${intermediate}.`,
                    add
                        ? `Compensa quitando 1: ${intermediate} - 1 = ${result}.`
                        : `Compensa devolviendo 1: ${intermediate} + 1 = ${result}.`
                );
            }

            case 7: {
                const number = rand(15, 85);
                const add = Math.random() < 0.5;
                const bridge = rand(1, 3) === 3;
                const intermediate = add ? number + 10 : number - 10;
                const result = add ? number + 11 : number - 11;
                return exercise(
                    7,
                    bridge
                        ? `${number} ${add ? '+' : '-'} 11 = ${intermediate} ${add ? '+' : '-'} ?`
                        : `${number} ${add ? '+' : '-'} 11`,
                    bridge ? 1 : result,
                    add
                        ? `Descompón 11 en 10 + 1: ${number} + 10 = ${intermediate}.`
                        : `Quita primero 10: ${number} - 10 = ${intermediate}.`,
                    add
                        ? `Añade el 1 restante: ${intermediate} + 1 = ${result}.`
                        : `Quita el 1 restante: ${intermediate} - 1 = ${result}.`
                );
            }

            case 8: {
                const variant = rand(1, 4);

                if (variant <= 2) {
                    const known = variant === 1 ? rand(1, 9) * 10 : rand(12, 88);
                    const answer = 100 - known;
                    const missingFirst = Math.random() < 0.5;
                    return exercise(
                        8,
                        missingFirst ? `? + ${known} = 100` : `${known} + ? = 100`,
                        answer,
                        `Completa primero la centena usando decenas y unidades.`,
                        `${known} + ${answer} = 100. La pareja es ${answer}.`
                    );
                }

                const a = rand(1, 5) * 10;
                const b = rand(11, Math.min(39, 99 - a));
                const knownTotal = a + b;
                const answer = 100 - knownTotal;
                const prompt = variant === 3
                    ? `${a} + ${b} + ? = 100`
                    : `? + ${a} + ${b} = 100`;
                return exercise(
                    8,
                    prompt,
                    answer,
                    `Junta los sumandos conocidos: ${a} + ${b} = ${knownTotal}.`,
                    `De ${knownTotal} a 100 faltan ${answer}.`
                );
            }

            case 9: {
                const tens = rand(1, 9) * 10;
                const unitsPool = [1, 2, 3, 4, 6, 7, 8, 9];
                const units = unitsPool[rand(0, unitsPool.length - 1)];
                const number = tens + units;
                const answer = units < 5 ? tens : tens + 10;
                return exercise(
                    9,
                    `Aproxima ${number} a la decena más cercana.`,
                    answer,
                    `Mira la cifra de las unidades. Si es menor que 5, baja; si es mayor que 5, sube.`,
                    `${number} está más cerca de ${answer}.`
                );
            }

            case 10: {
                const aUnits = rand(5, 9);
                const bUnits = rand(11 - aUnits, 9);
                const a = rand(1, 7) * 10 + aUnits;
                const b = rand(1, 4) * 10 + bUnits;
                const unitsTotal = aUnits + bUnits;
                const carriedTen = Math.floor(unitsTotal / 10);
                const answer = a + b;
                return exercise(
                    10,
                    `Calcula: ${a} + ${b}`,
                    answer,
                    `Suma las unidades: ${aUnits} + ${bUnits} = ${unitsTotal}. Deja ${unitsTotal % 10} y lleva ${carriedTen} decena.`,
                    `Suma las decenas con la llevada; el resultado completo es ${answer}.`
                );
            }

            case 11: {
                const hundreds = rand(2, 9);
                const tens = rand(1, 8);
                const units = rand(0, 4);
                const subHundreds = rand(1, hundreds - 1);
                const subTens = rand(0, tens - 1);
                const subUnits = rand(units + 1, 9);
                const minuend = hundreds * 100 + tens * 10 + units;
                const subtrahend = subHundreds * 100 + subTens * 10 + subUnits;
                const answer = minuend - subtrahend;
                return exercise(
                    11,
                    `Calcula: ${minuend} - ${subtrahend}`,
                    answer,
                    `${units} no permite quitar ${subUnits}; toma una decena y calcula ${units + 10} - ${subUnits}.`,
                    `Después resta las decenas, quitando la decena prestada, y las centenas. El resultado es ${answer}.`
                );
            }

            case 12: {
                const base = rand(2, 9);
                const factor = [10, 100, 1000][rand(0, 2)];
                const zeroCount = factor === 10 ? 1 : factor === 100 ? 2 : 3;
                const answer = base * factor;
                return exercise(
                    12,
                    `${base} × ${factor}`,
                    answer,
                    `Multiplicar por ${factor} es escribir ${zeroCount} ${zeroCount === 1 ? 'cero' : 'ceros'} a la derecha de ${base}.`,
                    `${base} × ${factor} = ${answer}.`
                );
            }

            case 13: {
                const thousands = rand(1, 9);
                const hundreds = rand(0, 9);
                const tens = rand(0, 9);
                const units = rand(0, 9);
                const number = thousands * 1000 + hundreds * 100 + tens * 10 + units;
                const variant = rand(1, 4);

                if (variant === 1) {
                    return exercise(
                        13,
                        `Descompón ${number} en UM, C, D y U. Usa el modelo 2UM + 3C + 4D + 5U.`,
                        `${thousands}UM + ${hundreds}C + ${tens}D + ${units}U`,
                        `Identifica el valor de posición de cada cifra, empezando por las unidades de millar.`,
                        `${number} = ${thousands}000 + ${hundreds}00 + ${tens}0 + ${units}.`
                    );
                }

                if (variant === 2) {
                    const baseHundreds = thousands * 10 + hundreds;
                    const answer = tens < 5
                        ? baseHundreds * 100
                        : (baseHundreds + 1) * 100;
                    return exercise(
                        13,
                        `Aproxima ${number} a la centena más cercana.`,
                        answer,
                        `Mira las decenas. Menos de 5 mantiene la centena; desde 5 aumenta una centena.`,
                        `${number} se aproxima a ${answer}.`
                    );
                }

                if (variant === 3) {
                    const difference = rand(1, Math.min(900, number - 1));
                    const smaller = number - difference;
                    return exercise(
                        13,
                        `¿Qué signo completa la comparación: ${smaller} ? ${number}? Escribe <, = o >.`,
                        '<',
                        `Compara las cifras de izquierda a derecha. Empieza por unidades de millar.`,
                        `${smaller} es menor que ${number}, por eso se usa <.`
                    );
                }

                const step = [10, 20, 50, 100][rand(0, 3)];
                const next = number + step;
                return exercise(
                    13,
                    `Completa la serie: ${number}, ${next}, ${next + step}, ?`,
                    next + step * 2,
                    `Busca cuánto aumenta cada número: ${step}.`,
                    `${next + step} + ${step} = ${next + step * 2}.`
                );
            }

            case 14: {
                const variant = rand(1, 4);

                if (variant === 1) {
                    const a = rand(1200, 4800);
                    const b = rand(1100, 4500);
                    const answer = a + b;
                    return exercise(
                        14,
                        `${a} + ${b}`,
                        answer,
                        `Coloca unidades con unidades, decenas con decenas, centenas con centenas y millares con millares.`,
                        `Suma por columnas desde la derecha, recordando las llevadas. El total es ${answer}.`
                    );
                }

                if (variant === 2) {
                    const a = rand(3000, 8900);
                    const b = rand(1000, a - 500);
                    const answer = a - b;
                    return exercise(
                        14,
                        `${a} - ${b}`,
                        answer,
                        `Resta desde las unidades. Si hace falta, toma una unidad del orden anterior.`,
                        `La diferencia entre ${a} y ${b} es ${answer}.`
                    );
                }

                if (variant === 3) {
                    const bought = rand(400, 2900);
                    const received = rand(300, 1900);
                    const has = rand(3000, 6000);
                    const final = has - bought + received;
                    return exercise(
                        14,
                        `Un dragón tiene ${has} monedas. Compra materiales por ${bought} y recibe ${received} monedas. ¿Cuántas le quedan?`,
                        final,
                        `Sigue los cambios en dos pasos: primero gasta, después recibe.`,
                        `${has} - ${bought} + ${received} = ${final} monedas.`
                    );
                }

                const total = rand(2500, 8000);
                const known = rand(500, total - 500);
                const answer = total - known;
                return exercise(
                    14,
                    `${known} + ? = ${total}`,
                    answer,
                    `Para encontrar la parte desconocida, resta la parte conocida al total.`,
                    `${total} - ${known} = ${answer}.`
                );
            }

            case 15: {
                const variant = rand(1, 6);

                if (variant === 1) {
                    const degrees = [30, 45, 60, 90, 110, 135, 160][rand(0, 6)];
                    const answer = degrees === 90 ? 'recto' : degrees < 90 ? 'agudo' : 'obtuso';
                    return exercise(
                        15,
                        `Un ángulo mide ${degrees}°. ¿Es agudo, recto u obtuso?`,
                        answer,
                        `Recuerda: un ángulo recto mide 90°. Un agudo mide menos y un obtuso mide más.`,
                        `${degrees}° corresponde a un ángulo ${answer}.`
                    );
                }

                if (variant === 2) {
                    return exercise(
                        15,
                        '¿Cómo se llaman las rectas que nunca se cruzan?',
                        'paralelas',
                        'Piensa en las dos orillas de una carretera: mantienen siempre la misma distancia.',
                        'Las rectas que nunca se cruzan son paralelas.'
                    );
                }

                if (variant === 3) {
                    return exercise(
                        15,
                        '¿Cómo se llaman las rectas que se cortan formando ángulos rectos?',
                        'perpendiculares',
                        'Cada ángulo recto mide 90°.',
                        'Las rectas que forman ángulos rectos al cruzarse son perpendiculares.'
                    );
                }

                if (variant === 4) {
                    return exercise(
                        15,
                        '¿Cuántos ángulos rectos forman dos rectas perpendiculares? Escribe solo el número.',
                        4,
                        'Dibuja el cruce de una +: aparecen cuatro regiones iguales.',
                        'Dos rectas perpendiculares forman 4 ángulos rectos.'
                    );
                }

                if (variant === 5) {
                    return exercise(
                        15,
                        'Si una figura se copia cambiándola de posición sin girarla, ¿cómo se llama ese movimiento?',
                        'traslacion',
                        'La figura conserva su forma, tamaño y orientación.',
                        'Cambiar una figura de posición sin girarla es una traslación.'
                    );
                }

                return exercise(
                    15,
                    '¿Cuántos ejes de simetría tiene un cuadrado? Escribe solo el número.',
                    4,
                    'Al doblar por un eje de simetría, las dos partes coinciden exactamente.',
                    'Un cuadrado tiene 4 ejes de simetría.'
                );
            }

            case 16: {
                const factor = rand(2, 9);
                const times = rand(2, 9);
                const product = factor * times;
                const variant = rand(1, 4);

                if (variant === 1) {
                    return exercise(
                        16,
                        `${factor} × ${times}`,
                        product,
                        `Interpreta la multiplicación como ${times} grupos iguales de ${factor}.`,
                        `${factor} × ${times} = ${product}.`
                    );
                }

                if (variant === 2) {
                    return exercise(
                        16,
                        `Escribe el factor que falta: ? × ${times} = ${product}.`,
                        factor,
                        `Busca qué número repetido ${times} veces da ${product}.`,
                        `${factor} × ${times} = ${product}.`
                    );
                }

                if (variant === 3) {
                    const sum = Array(times).fill(factor).join(' + ');
                    return exercise(
                        16,
                        `¿Cuántas veces se repite el ${factor} en ${sum}?`,
                        times,
                        `Cuenta el número de sumandos iguales.`,
                        `El ${factor} aparece ${times} veces: ${times} × ${factor} = ${product}.`
                    );
                }

                const groups = rand(3, 8);
                const each = rand(2, 9);
                return exercise(
                    16,
                    `Hay ${groups} cofres con ${each} gemas en cada uno. ¿Cuántas gemas hay?`,
                    groups * each,
                    `Todos los cofres tienen la misma cantidad; multiplica grupos por elementos.`,
                    `${groups} × ${each} = ${groups * each} gemas.`
                );
            }

            case 101: {
                const hundreds = rand(1, 9);
                const tens = rand(0, 9);
                const units = rand(0, 9);
                const number = hundreds * 100 + tens * 10 + units;
                return exercise(
                    101,
                    `Descompón ${number}. Usa el modelo 4C + 2D + 7U.`,
                    `${hundreds}C + ${tens}D + ${units}U`,
                    `Las centenas indican grupos de 100, las decenas grupos de 10 y las unidades quedan sueltas.`,
                    `${number} = ${hundreds * 100} + ${tens * 10} + ${units} = ${hundreds}C + ${tens}D + ${units}U.`
                );
            }

            case 102: {
                const step = [2, 5, 10][rand(0, 2)];
                const start = rand(1, 5) * step;
                const third = start + step * 2;
                const answer = start + step * 3;
                return exercise(
                    102,
                    `Completa la serie: ${start}, ${start + step}, ${third}, ?`,
                    answer,
                    `Observa el salto entre los números. La serie aumenta de ${step} en ${step}.`,
                    `${third} + ${step} = ${answer}.`
                );
            }

            default:
                return generateByStrategy(1);
        }
    }

    window.DragonApp.Generator = { generateByStrategy };
    window.DragonApp.GeneratorMath = { generateByStrategy };
})();

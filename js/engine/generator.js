window.DragonApp = window.DragonApp || {};

(function () {
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateByStrategy(strategyId) {
        switch (Number(strategyId)) {
            case 1: { // Amigos del 10 (Incógnitas en cualquier posición y 3 sumandos con descomposición)
                const variant = rand(1, 6);

                if (variant === 1) {
                    const a = rand(1, 9);
                    const ans = 10 - a;
                    return {
                        strategyId: 1,
                        prompt: `${a} + ? = 10`,
                        answer: ans,
                        paso1: `Buscamos la pareja del ${a} para llegar a 10`,
                        paso2: `${a} + ${ans} = 10`
                    };
                } else if (variant === 2) {
                    const b = rand(1, 9);
                    const ans = 10 - b;
                    return {
                        strategyId: 1,
                        prompt: `? + ${b} = 10`,
                        answer: ans,
                        paso1: `El amigo del ${b} para formar 10 es ${ans}`,
                        paso2: `${ans} + ${b} = 10`
                    };
                } else if (variant === 3) {
                    const a = rand(1, 6);
                    const b = rand(1, 8 - a);
                    const suma = a + b;
                    const ans = 10 - suma;
                    return {
                        strategyId: 1,
                        prompt: `${a} + ${b} + ? = 10`,
                        answer: ans,
                        paso1: `Juntamos los dos primeros: ${a} + ${b} = ${suma}`,
                        paso2: `El amigo del ${suma} para llegar a 10 es ${ans}`
                    };
                } else if (variant === 4) {
                    const a = rand(1, 6);
                    const b = rand(1, 8 - a);
                    const suma = a + b;
                    const ans = 10 - suma;
                    return {
                        strategyId: 1,
                        prompt: `${a} + ? + ${b} = 10`,
                        answer: ans,
                        paso1: `Sumamos los conocidos: ${a} + ${b} = ${suma}`,
                        paso2: `De ${suma} hasta 10 faltan ${ans}`
                    };
                } else if (variant === 5) {
                    const a = rand(1, 6);
                    const b = rand(1, 8 - a);
                    const suma = a + b;
                    const ans = 10 - suma;
                    return {
                        strategyId: 1,
                        prompt: `? + ${a} + ${b} = 10`,
                        answer: ans,
                        paso1: `Agrupamos: ${a} + ${b} = ${suma}`,
                        paso2: `El amigo del ${suma} es ${ans} (${ans} + ${suma} = 10)`
                    };
                } else {
                    // Descomponer el 2º sumando buscando el amigo del 10 (ej: 7 + 5 = 7 + 3 + ?)
                    const a = rand(6, 9);
                    const amigo = 10 - a;
                    const b = rand(amigo + 1, 9);
                    const sobra = b - amigo;
                    return {
                        strategyId: 1,
                        prompt: `${a} + ${b} = ${a} + ${amigo} + ?`,
                        answer: sobra,
                        paso1: `Para hacer 10 con el ${a}, partimos el ${b} en ${amigo} y ${sobra}`,
                        paso2: `${a} + ${amigo} = 10, y faltan por poner ${sobra}`
                    };
                }
            }

            case 2: { // Amigos del 100 (Incógnitas y 3 sumandos hacia 100)
                const variant = rand(1, 4);

                if (variant <= 2) {
                    const isExactTen = Math.random() < 0.35;
                    const a = isExactTen ? rand(1, 9) * 10 : rand(12, 88);
                    const b = 100 - a;
                    const nextTen = Math.ceil(a / 10) * 10;
                    const toTen = nextTen - a;
                    const toHundred = 100 - nextTen;

                    const promptStr = variant === 1 ? `${a} + ? = 100` : `? + ${a} = 100`;
                    return {
                        strategyId: 2,
                        prompt: promptStr,
                        answer: b,
                        paso1: toTen > 0 ? `Hasta la siguiente decena: ${a} + ${toTen} = ${nextTen}` : `${a} ya es decena exacta`,
                        paso2: toTen > 0 ? `De ${nextTen} a 100 van ${toHundred} → ${toTen} + ${toHundred} = ${b}` : `${a} + ${b} = 100`
                    };
                } else {
                    const a = rand(1, 5) * 10;
                    const b = rand(11, 39);
                    const suma = a + b;
                    const ans = 100 - suma;
                    const promptStr = variant === 3 ? `${a} + ${b} + ? = 100` : `? + ${a} + ${b} = 100`;
                    return {
                        strategyId: 2,
                        prompt: promptStr,
                        answer: ans,
                        paso1: `Juntamos los conocidos: ${a} + ${b} = ${suma}`,
                        paso2: `De ${suma} hasta 100 faltan ${ans}`
                    };
                }
            }

            case 3: { // Llegar a la decena (Directa, Puente a la decena e Incógnita)
                const decena = rand(2, 8) * 10;
                const unidad = rand(3, 9);
                const a = decena + unidad;
                const faltaDecena = 10 - unidad;
                const b = rand(faltaDecena + 1, 9);
                const resto = b - faltaDecena;
                const nextDecena = decena + 10;
                const total = a + b;

                const variant = rand(1, 3);
                if (variant === 1) {
                    // Directa: 47 + 6
                    return {
                        strategyId: 3,
                        prompt: `${a} + ${b}`,
                        answer: total,
                        paso1: `Completamos la decena: ${a} + ${faltaDecena} = ${nextDecena}`,
                        paso2: `Sumamos los ${resto} restantes: ${nextDecena} + ${resto} = ${total}`
                    };
                } else if (variant === 2) {
                    // Puente explícito: 47 + 6 = 50 + ?
                    return {
                        strategyId: 3,
                        prompt: `${a} + ${b} = ${nextDecena} + ?`,
                        answer: resto,
                        paso1: `De ${a} hasta ${nextDecena} hemos usado ${faltaDecena} del ${b}`,
                        paso2: `Del ${b} todavía nos quedan ${resto} (${nextDecena} + ${resto} = ${total})`
                    };
                } else {
                    // Sumando oculto pasando decena: 47 + ? = 53
                    return {
                        strategyId: 3,
                        prompt: `${a} + ? = ${total}`,
                        answer: b,
                        paso1: `De ${a} hasta ${nextDecena} van ${faltaDecena}`,
                        paso2: `Y de ${nextDecena} hasta ${total} van ${resto} → ${faltaDecena} + ${resto} = ${b}`
                    };
                }
            }

            case 4: { // Restas inteligentes pasando por la decena (Directa, Puente e Incógnita)
                const decena = rand(3, 9) * 10;
                const unidad = rand(1, 7);
                const minuendo = decena + unidad;
                const sustraendo = rand(unidad + 1, 9);
                const resto = sustraendo - unidad;
                const resultado = minuendo - sustraendo;

                const variant = rand(1, 3);
                if (variant === 1) {
                    // Directa: 54 - 8
                    return {
                        strategyId: 4,
                        prompt: `${minuendo} - ${sustraendo}`,
                        answer: resultado,
                        paso1: `Bajamos a la decena: ${minuendo} - ${unidad} = ${decena}`,
                        paso2: `Quitamos los ${resto} que faltan: ${decena} - ${resto} = ${resultado}`
                    };
                } else if (variant === 2) {
                    // Puente a la decena: 54 - 8 = 50 - ?
                    return {
                        strategyId: 4,
                        prompt: `${minuendo} - ${sustraendo} = ${decena} - ?`,
                        answer: resto,
                        paso1: `Para bajar de ${minuendo} a ${decena} ya hemos quitado ${unidad}`,
                        paso2: `Del ${sustraendo} nos faltan por quitar ${resto} (${decena} - ${resto} = ${resultado})`
                    };
                } else {
                    // Sustraendo oculto pasando decena: 54 - ? = 46
                    return {
                        strategyId: 4,
                        prompt: `${minuendo} - ? = ${resultado}`,
                        answer: sustraendo,
                        paso1: `De ${minuendo} bajamos a ${decena} quitando ${unidad}`,
                        paso2: `De ${decena} a ${resultado} quitamos ${resto} más → ${unidad} + ${resto} = ${sustraendo}`
                    };
                }
            }

            case 5: { // Dobles y Mitades (Cálculo de doble, mitad como ? + ? = 2n y descomposición)
                const pool = [6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 24, 25, 26, 35, 45];
                const n = pool[rand(0, pool.length - 1)];
                const dec = Math.floor(n / 10) * 10;
                const uni = n % 10;
                const doble = n * 2;

                const variant = rand(1, 3);
                if (variant === 1) {
                    return {
                        strategyId: 5,
                        prompt: `${n} + ${n}`,
                        answer: doble,
                        paso1: dec > 0 ? `Doble de las decenas: ${dec} + ${dec} = ${dec * 2}` : `Pensamos el doble de ${n}`,
                        paso2: dec > 0 ? `Doble de unidades: ${uni} + ${uni} = ${uni * 2} → ${dec * 2} + ${uni * 2} = ${doble}` : `${n} + ${n} = ${doble}`
                    };
                } else if (variant === 2) {
                    // Pensamiento inverso (Mitad): ? + ? = 30
                    return {
                        strategyId: 5,
                        prompt: `? + ? = ${doble}`,
                        answer: n,
                        paso1: dec > 0 ? `Mitad de ${dec * 2} es ${dec}, y mitad de ${uni * 2} es ${uni}` : `Buscamos la mitad de ${doble}`,
                        paso2: `${n} + ${n} = ${doble}`
                    };
                } else {
                    // Falta un sumando del doble: 16 + ? = 32
                    return {
                        strategyId: 5,
                        prompt: `${n} + ? = ${doble}`,
                        answer: n,
                        paso1: `${doble} es el doble exacto de ${n}`,
                        paso2: `${n} + ${n} = ${doble}`
                    };
                }
            }

            case 6: { // Casi dobles (Directa y apoyo visual en el doble)
                const n = rand(6, 25);
                const m = n + 1;
                const doble = n * 2;
                const total = doble + 1;
                const firstBig = Math.random() < 0.5;

                const variant = rand(1, 3);
                if (variant <= 2) {
                    return {
                        strategyId: 6,
                        prompt: firstBig ? `${m} + ${n}` : `${n} + ${m}`,
                        answer: total,
                        paso1: `Usamos el doble de ${n}: ${n} + ${n} = ${doble}`,
                        paso2: `Y añadimos 1 más: ${doble} + 1 = ${total}`
                    };
                } else {
                    // Incógnita casi doble: 15 + ? = 31
                    return {
                        strategyId: 6,
                        prompt: `${n} + ? = ${total}`,
                        answer: m,
                        paso1: `Si el doble es ${n} + ${n} = ${doble}, para llegar a ${total} necesitamos 1 más`,
                        paso2: `${n} + ${m} = ${total}`
                    };
                }
            }

            case 7: { // +9 y -9 (Directa y puente de compensación +10 - 1)
                const isAdd = Math.random() < 0.6;
                const n = rand(14, 88);
                const variant = rand(1, 3);

                if (isAdd) {
                    if (variant <= 2) {
                        return {
                            strategyId: 7,
                            prompt: `${n} + 9`,
                            answer: n + 9,
                            paso1: `Sumamos 10: ${n} + 10 = ${n + 10}`,
                            paso2: `Restamos 1: ${n + 10} - 1 = ${n + 9}`
                        };
                    } else {
                        // Puente de compensación: 48 + 9 = 58 - ?
                        return {
                            strategyId: 7,
                            prompt: `${n} + 9 = ${n + 10} - ?`,
                            answer: 1,
                            paso1: `Sumar 9 es igual que sumar 10 (${n + 10}) y quitar 1`,
                            paso2: `${n + 10} - 1 = ${n + 9}`
                        };
                    }
                } else {
                    if (variant <= 2) {
                        return {
                            strategyId: 7,
                            prompt: `${n} - 9`,
                            answer: n - 9,
                            paso1: `Restamos 10: ${n} - 10 = ${n - 10}`,
                            paso2: `Sumamos 1: ${n - 10} + 1 = ${n - 9}`
                        };
                    } else {
                        // Puente de compensación en resta: 54 - 9 = 44 + ?
                        return {
                            strategyId: 7,
                            prompt: `${n} - 9 = ${n - 10} + ?`,
                            answer: 1,
                            paso1: `Restar 9 es igual que quitar 10 (${n - 10}) y devolver 1`,
                            paso2: `${n - 10} + 1 = ${n - 9}`
                        };
                    }
                }
            }

            case 8:
            default: { // +11 y -11 (Directa y descomposición +10 + 1)
                const isAdd = Math.random() < 0.6;
                const n = rand(15, 85);
                const variant = rand(1, 3);

                if (isAdd) {
                    if (variant <= 2) {
                        return {
                            strategyId: 8,
                            prompt: `${n} + 11`,
                            answer: n + 11,
                            paso1: `Sumamos 10: ${n} + 10 = ${n + 10}`,
                            paso2: `Y sumamos 1 más: ${n + 10} + 1 = ${n + 11}`
                        };
                    } else {
                        return {
                            strategyId: 8,
                            prompt: `${n} + 11 = ${n + 10} + ?`,
                            answer: 1,
                            paso1: `Para sumar 11, primero sumamos 10 (${n + 10})`,
                            paso2: `Y añadimos 1 unidad más: ${n + 10} + 1 = ${n + 11}`
                        };
                    }
                } else {
                    if (variant <= 2) {
                        return {
                            strategyId: 8,
                            prompt: `${n} - 11`,
                            answer: n - 11,
                            paso1: `Restamos 10: ${n} - 10 = ${n - 10}`,
                            paso2: `Y quitamos 1 más: ${n - 10} - 1 = ${n - 11}`
                        };
                    } else {
                        return {
                            strategyId: 8,
                            prompt: `${n} - 11 = ${n - 10} - ?`,
                            answer: 1,
                            paso1: `Para restar 11, primero quitamos 10 (${n - 10})`,
                            paso2: `Y quitamos 1 unidad más: ${n - 10} - 1 = ${n - 11}`
                        };
                    }
                }
            }
        }
    }

    window.DragonApp.Generator = {
        generateByStrategy
    };
})();
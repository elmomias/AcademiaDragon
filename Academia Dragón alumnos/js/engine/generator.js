window.DragonApp = window.DragonApp || {};

(function () {
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const students = [
        'Israel', 'Marco', 'Elisabeth', 'Andrea', 'Ishak', 'Carmen',
        'Arianna', 'Ángel', 'Marta', 'Lyam', 'Juan Antonio', 'Hugo',
        'Noah', 'Romays', 'Omar', 'Adrián', 'Oona', 'Mouna',
        'Kiko', 'Alicia', 'Adam', 'Arabia'
    ];
    const studentGender = {
        Israel: 'chico',
        Marco: 'chico',
        Elisabeth: 'chica',
        Andrea: 'chica',
        Ishak: 'chico',
        Carmen: 'chica',
        Arianna: 'chica',
        Ángel: 'chico',
        Marta: 'chica',
        Lyam: 'chico',
        Juan Antonio: 'chico',
        Hugo: 'chico',
        Noah: 'chico',
        Romays: 'chico',
        Omar: 'chico',
        Adrián: 'chico',
        Oona: 'chica',
        Mouna: 'chica',
        Kiko: 'chico',
        Alicia: 'chica',
        Adam: 'chico',
        Arabia: 'chica'
    };

    const stories = {
        1: {
            title: 'El enigma de la biblioteca encantada',
            location: 'la biblioteca encantada',
            participants: ['Marco', 'Oona'],
            beats: [
                'Una lámpara parpadea junto a un libro cerrado.',
                'El dragón Lume deja una marca dorada en una estantería.',
                'Aparece una tarjeta escondida entre dos atlas.',
                'El reloj de la sala se para de repente.',
                'El bibliotecario invisible deja una pista bajo la mesa.'
            ]
        },
        2: {
            title: 'El susurro del bosque de esmeraldas',
            location: 'el bosque de esmeraldas',
            participants: ['Adrián', 'Mouna', 'Ishak', 'Carmen'],
            beats: [
                'Una hoja verde vibra aunque no corre viento.',
                'El duende Briz aparece detrás de un tronco.',
                'Cuatro piedras forman un camino desconocido.',
                'Un búho señala una rama con el ala.',
                'La fuente del bosque dibuja símbolos sobre el agua.'
            ]
        },
        3: {
            title: 'El tren que llegó sin hora',
            location: 'la antigua estación',
            participants: ['Lyam', 'Alicia', 'Hugo', 'Oona', 'Noah', 'Arabia'],
            beats: [
                'Un tren sin conductor se detiene junto al andén.',
                'La máquina muestra un billete de color violeta.',
                'Una maleta se mueve dentro del vagón silencioso.',
                'El conductor fantasma Firmin dejó una pizarra.',
                'El reloj de la estación gira al revés.'
            ]
        },
        4: {
            title: 'El observatorio bajo la tormenta',
            location: 'el observatorio',
            participants: ['Arianna', 'Juan Antonio'],
            beats: [
                'Un telescopio apunta a una estrella ausente.',
                'La constelación forma una flecha sobre el cristal.',
                'Una esfera celeste gira sin que nadie la toque.',
                'La dragona Astra deja un mapa de luz.',
                'El trueno revela números sobre la cúpula.'
            ]
        },
        5: {
            title: 'La puerta sin llave del castillo',
            location: 'el castillo de las llaves',
            participants: ['Elisabeth', 'Ángel', 'Romays', 'Adam'],
            beats: [
                'Una puerta aparece donde antes solo había una pared.',
                'El guardián Tork deja cuatro cerraduras abiertas.',
                'Una sombra entrega una caja sin tapa.',
                'Las antorchas proyectan letras sobre el suelo.',
                'Una cadena dorada marca una última pista.'
            ]
        },
        6: {
            title: 'La aventura final de toda la clase',
            location: 'el laberinto del dragón',
            participants: students,
            beats: [
                'Toda la clase escucha el rugido protector del dragón Auren.',
                'Veintidós linternas dibujan una ruta en la pared.',
                'El gran puente se ilumina al resolver cada pista.',
                'Un espejo repite una palabra distinta.',
                'La salida aparece cuando la clase comparte sus saberes.'
            ]
        }
    };

    function resolveOptions(options = {}) {
        const source = options && typeof options === 'object' ? options : {};
        const rawQuestion = source.questionNumber ?? source.index ?? source.sceneStep;
        const questionNumber = Number.isInteger(Number(rawQuestion))
            ? Math.min(20, Math.max(1, Number(rawQuestion)))
            : rand(1, 20);
        const recovery2 = Boolean(
            source.recovery2
            || source.recuperacion2
            || source.isRecovery2
            || window.DragonApp.recovery2
            || window.DragonApp.recuperacion2
        );
        const mastered = Array.isArray(source.masteredStrategies) ? source.masteredStrategies : [];

        return {
            questionNumber,
            level: questionNumber <= 10 ? 1 : 2,
            recovery2,
            mastered
        };
    }

    function shuffled(options, answer) {
        const unique = Array.from(new Set([String(answer), ...options.map(String)]));
        const numericAnswer = Number(answer);
        let offset = 1;
        while (unique.length < 3 && Number.isFinite(numericAnswer)) {
            unique.push(String(Math.max(0, numericAnswer + offset)));
            offset = offset > 0 ? -offset : -offset + 1;
        }
        if (unique.length < 3) unique.push('No corresponde');
        if (unique.length < 3) unique.push('Ninguna de estas');
        for (let i = unique.length - 1; i > 0; i -= 1) {
            const j = rand(0, i);
            [unique[i], unique[j]] = [unique[j], unique[i]];
        }
        return unique.slice(0, 3);
    }

    function result(answer, alternatives, paso1, paso2, prompt) {
        return {
            prompt,
            answer,
            options: shuffled(alternatives.filter(item => String(item) !== String(answer)), answer),
            paso1,
            paso2
        };
    }

    function mathEnigma(strategyId, level, recovery2, seed) {
        const advanced = level === 2;
        const value = recovery2
            ? 2 + seed % 8 + (advanced ? 10 : 0)
            : 4 + seed % 12 + (advanced ? 30 : 0);

        switch (Number(strategyId)) {
            case 1: {
                const known = Math.min(10, value);
                return result(10 - known, [known, 10 + known], 'Completa la pareja del 10.', `${known} + ${10 - known} = 10.`, `¿Qué número completa ${known} + ? = 10?`);
            }
            case 2: {
                const toTen = 10 - value % 10;
                return result(toTen, [toTen - 1, toTen + 1], 'Cuenta cuánto falta para llegar a la decena.', `Al unir ${value % 10} unidades con ${toTen} completas otra decena.`, `En ${value}, ¿cuántas unidades faltan para completar la siguiente decena?`);
            }
            case 3:
                return result(value * 2, [value * 2 - 2, value * 2 + 2], 'Suma el número dos veces.', `${value} + ${value} = ${value * 2}.`, `¿Cuál es el doble de ${value}?`);
            case 4: {
                const subtract = advanced ? 7 : 4;
                return result(value - subtract, [value + subtract, value - subtract + 2], 'Cuenta hacia atrás o baja primero a la decena.', `${value} - ${subtract} = ${value - subtract}.`, `El candado muestra ${value} - ${subtract}. ¿Qué resultado aparece?`);
            }
            case 5:
                return result(value * 2 + 1, [value * 2, value * 2 + 2], 'Dos consecutivos equivalen al doble del menor y uno más.', `${value} + ${value + 1} = ${value * 2 + 1}.`, `¿Cuánto es ${value} + ${value + 1}?`);
            case 6:
                return result(value + 9, [value + 8, value + 10], 'Suma 10 y compensa quitando 1.', `${value} + 10 - 1 = ${value + 9}.`, `¿Cuánto es ${value} + 9?`);
            case 7:
                return result(value + 11, [value + 10, value + 12], 'Descompón 11 en 10 + 1.', `${value} + 10 + 1 = ${value + 11}.`, `¿Cuánto es ${value} + 11?`);
            case 8:
                return result(100 - value, [90 - value, 110 - value], 'Busca el complemento hasta 100.', `${value} + ${100 - value} = 100.`, `¿Qué número completa ${value} + ? = 100?`);
            case 9: {
                const number = advanced ? value + 6 : value + 1;
                const rounded = Math.round(number / 10) * 10;
                return result(rounded, [rounded - 10, rounded + 10], 'Mira las unidades: 0-4 baja y 5-9 sube.', `${number} está más cerca de ${rounded}.`, `¿A qué decena se aproxima ${number}?`);
            }
            case 10: {
                const second = 5 + seed % 5;
                return result(value + second, [value + second - 2, value + second + 2], 'Suma primero unidades, después las decenas.', `${value} + ${second} = ${value + second}.`, `¿Cuánto es ${value} + ${second}?`);
            }
            case 11: {
                const second = 5 + seed % 4;
                return result(value - second, [value - second + 1, value - second - 1], 'Si hace falta, pide una decena.', `${value} - ${second} = ${value - second}.`, `El mural muestra ${value} - ${second}. ¿Cuál es el resultado?`);
            }
            case 12:
                return result(value * (advanced ? 100 : 10), [value * 10, value * 1000], 'Multiplicar por la unidad seguida de ceros desplaza el número.', `${value} × ${advanced ? 100 : 10} = ${value * (advanced ? 100 : 10)}.`, `¿Cuánto es ${value} × ${advanced ? 100 : 10}?`);
            case 13: {
                const step = advanced ? 10 : 2;
                const next = value + step * 3;
                return result(next, [next - step, next + step], `La serie avanza de ${step} en ${step}.`, `${value + step * 2} + ${step} = ${next}.`, `Completa: ${value}, ${value + step}, ${value + step * 2}, ?`);
            }
            case 14: {
                const second = 3 + seed % 7;
                return result(value + second, [value + second - 1, value + second + 1], 'Agrupa unidades y decenas.', `${value} + ${second} = ${value + second}.`, `¿Qué número abre el cofre: ${value} + ${second}?`);
            }
            case 15:
                return result('90', ['45', '180'], 'Un ángulo recto mide 90 grados.', 'La apertura de un ángulo recto es de 90°.', '¿Cuántos grados mide un ángulo recto?');
            case 16: {
                const factor = 2 + seed % 5;
                const product = factor * (advanced ? 6 : 3);
                return result(product, [product - factor, product + factor], 'La multiplicación repite grupos iguales.', `${factor} × ${advanced ? 6 : 3} = ${product}.`, `¿Cuánto es ${factor} × ${advanced ? 6 : 3}?`);
            }
            case 101: {
                const hundreds = advanced ? 3 : 2;
                const total = hundreds * 100 + value;
                return result(hundreds, [hundreds - 1, hundreds + 1], 'Mira la cifra de las centenas.', `En ${total}, la cifra de las centenas es ${hundreds}.`, `En ${total}, ¿cuántas centenas hay?`);
            }
            case 102: {
                const step = advanced ? 5 : 2;
                return result(value + step * 3, [value + step * 2, value + step * 4], `La serie avanza de ${step} en ${step}.`, `Después de ${value}, los saltos terminan en ${value + step * 3}.`, `Completa la serie: ${value}, ${value + step}, ${value + step * 2}, ?`);
            }
            default:
                return mathEnigma(1, level, recovery2, seed);
        }
    }

    function languageEnigma(strategyId, level, recovery2, seed) {
        const index = seed % 4;
        const simple = level === 1 || recovery2;
        switch (Number(strategyId)) {
            case 1: {
                const item = [
                    ['__eso', 'qu', 'queso'],
                    ['__ina', 'qu', 'quina'],
                    ['_opa', 'c', 'copa'],
                    ['cara_ol', 'c', 'caracol']
                ][index];
                validateSpellingMask(item);
                return result(item[1], ['c', 'qu', 'gu'], 'Usa «qu» antes de e/i y «c» antes de a/o/u.', `La forma correcta es «${item[2]}».`, `¿Qué letras completan «${item[0]}»?`);
            }
            case 2: {
                const item = [
                    ['pin__ino', 'gü', 'pingüino'],
                    ['ci__eña', 'gü', 'cigüeña'],
                    ['man__era', 'gu', 'manguera'],
                    ['__itarra', 'gu', 'guitarra']
                ][index];
                validateSpellingMask(item);
                return result(item[1], ['g', 'gu', 'gü'], 'Usa diéresis si la u debe sonar.', `La forma correcta es «${item[2]}».`, `¿Qué letras completan «${item[0]}»?`);
            }
            case 3:
                return result('Marta', ['marta', 'MARTA.'], 'Los nombres propios empiezan con mayúscula.', 'Marta se escribe con mayúscula inicial.', '¿Cómo se escribe correctamente el nombre propio Marta en una oración?');
            case 4: {
                const pairs = [
                    ['alegre', 'contento'], ['rápido', 'veloz'], ['alto', 'bajo'], ['encender', 'apagar']
                ];
                const pair = pairs[index];
                const relation = index < 2 ? 'sinónimo' : 'antónimo';
                return result(pair[1], [pair[0], 'redondo'], `Busca el ${relation} de «${pair[0]}».`, `«${pair[1]}» es el ${relation} de «${pair[0]}».`, `¿Cuál es un ${relation} de «${pair[0]}»?`);
            }
            case 5: {
                const item = simple ? ['sol', 'casa', 'camisa', 'mariposa'][index] : ['café', 'árbol', 'música', 'pájaro'][index];
                const syllableCounts = {
                    sol: 1, casa: 2, camisa: 3, mariposa: 4,
                    café: 2, árbol: 2, música: 3, pájaro: 3
                };
                const count = syllableCounts[item];
                return result(count, [count - 1, count + 1], 'Separa la palabra en sílabas con palmadas.', `${item} tiene ${count} sílabas.`, `¿Cuántas sílabas tiene «${item}»?`);
            }
            case 6:
                return result('Alicia', ['ellas', 'vosotros'], 'Un nombre propio identifica a una persona concreta.', 'Alicia es un nombre propio de la relación.', '¿Cuál de estas opciones es un nombre propio?');
            case 7:
                return result('brillante', ['corre', 'estrella'], 'El adjetivo explica cómo es un sustantivo.', 'Brillante describe una cualidad.', 'En «la llave brillante», ¿qué palabra es el adjetivo?');
            case 8:
                return result('resuelve', ['castillo', 'brillante'], 'El verbo expresa una acción o proceso.', '«Resuelve» indica una acción.', '¿Qué palabra es un verbo?');
            case 9:
                return result('interrogativa', ['exclamativa', 'enunciativa'], 'La pregunta pide información y lleva signos de interrogación.', 'La frase es una oración interrogativa.', '¿Qué tipo de oración es «¿Dónde está la pista?»?');
            case 10:
                return result('¿Dónde está la llave?', ['Donde está la llave.', '¡Dónde está la llave!'], 'Una pregunta empieza con ¿ y termina con ?.', 'La interrogación necesita signos inicial y final.', '¿Qué oración está puntuada correctamente?');
            case 11:
                return result('panadero', ['panal', 'mano'], 'Una familia comparte la misma raíz.', 'Panadero pertenece a la familia de pan.', '¿Qué palabra pertenece a la familia de «pan»?');
            case 12:
                return result('Primero buscaron la llave. Después abrieron el cofre.', ['Después abrieron el cofre. Primero buscaron la llave.', 'Buscaron llave cofre después.'], 'Los conectores primero/después ordenan las acciones.', 'Primero se busca y después se abre.', '¿Qué secuencia está ordenada?');
            default:
                return languageEnigma(3, level, recovery2, seed);
        }
    }

    function validateSpellingMask([mask, missing, complete]) {
        const blank = '_'.repeat(Array.from(missing).length);
        if (!mask.includes(blank) || mask.replace(blank, missing) !== complete) {
            throw new Error(`La máscara ortográfica no coincide con «${complete}»: «${mask}»`);
        }
    }

    function getMasteredSkill(mastered, seed) {
        const valid = mastered.filter(item => item
            && (item.subject === 'math' || item.subject === 'lengua')
            && Number.isFinite(Number(item.strategyId)));
        if (!valid.length) return { subject: 'math', strategyId: 1 };
        return valid[(seed - 1) % valid.length];
    }

    function buildEnigma(settings, index) {
        const skill = getMasteredSkill(settings.mastered, settings.questionNumber + index);
        return skill.subject === 'lengua'
            ? languageEnigma(skill.strategyId, settings.level, settings.recovery2, index)
            : mathEnigma(skill.strategyId, settings.level, settings.recovery2, index);
    }

    function exercise(strategyId, settings, story, enigma) {
        const members = story.participants.length > 2
            ? `${story.participants.slice(0, -1).join(', ')} y ${story.participants[story.participants.length - 1]}`
            : story.participants.join(' y ');
        const beat = story.beats[(settings.questionNumber - 1) % story.beats.length];
        const template = settings.questionNumber <= 10
            ? `${members} llegan a ${story.location}. ${beat} En el objeto aparece esta pista: {ENIGMA_1}`
            : `El misterio de ${story.location} está a punto de resolverse. ${beat} Para seguir, el grupo descifra esta pista: {ENIGMA_2}`;
        const placeholder = settings.questionNumber <= 10 ? '{ENIGMA_1}' : '{ENIGMA_2}';

        return {
            strategyId: Number(strategyId),
            level: settings.level,
            questionNumber: settings.questionNumber,
            recovery2: settings.recovery2,
            prompt: `${template.replace(placeholder, enigma.prompt)}`,
            text: `${beat} El equipo comparte la pista antes de responder.`,
            answer: String(enigma.answer),
            options: enigma.options,
            paso1: enigma.paso1,
            paso2: enigma.paso2,
            participants: story.participants,
            participantGender: story.participants.map(name => ({
                name,
                gender: studentGender[name]
            })),
            sceneStep: settings.questionNumber,
            storyTitle: story.title
        };
    }

    function generateByStrategy(strategyId, options = {}) {
        const settings = resolveOptions(options);
        const id = Number(strategyId);
        switch (id) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                return exercise(id, settings, stories[id], buildEnigma(settings, id));
            default:
                return exercise(1, settings, stories[1], buildEnigma(settings, 1));
        }
    }

    function getMysteryStoriesList() {
        return Object.entries(stories).map(([id, story]) => ({
            id: Number(id),
            title: story.title,
            participants: story.participants
        }));
    }

    window.DragonApp.Generator = {
        generateByStrategy,
        getMysteryStoriesList
    };
    window.DragonApp.GeneratorMystery = window.DragonApp.Generator;
})();

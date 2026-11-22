window.DragonApp = window.DragonApp || {};

(function () {
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const questionCounters = {};
    const pick = (values, options = {}) => {
        const rawQuestion = options.questionNumber ?? options.index;
        const questionNumber = Number.isInteger(Number(rawQuestion))
            ? Math.min(20, Math.max(1, Number(rawQuestion)))
            : rand(1, 20);
        return values[(questionNumber - 1) % values.length];
    };
    const shuffle = values => [...values].sort(() => Math.random() - 0.5);
    const unique = values => [...new Set(values)];
    const orthographyCQu = [
        ['mos__ito', 'qu', 'mosquito', 'moscito', 'moskito', "Delante de e o i, el sonido /k/ se escribe con «qu»."],
        ['má__ina', 'qu', 'máquina', 'mácina', 'maquina', "Delante de i, el sonido /k/ se escribe con «qu»."],
        ['cara_ol', 'c', 'caracol', 'caraquol', 'caracól', "Delante de a, o o u, el sonido /k/ se escribe con «c»."],
        ['es__eleto', 'qu', 'esqueleto', 'esceleto', 'esqueletó', "La sílaba «que» se escribe con «qu»."],
        ['pe__eño', 'qu', 'pequeño', 'peceno', 'pequeno', "El sonido /k/ se escribe con «qu» en «que»."],
        ['_asa', 'c', 'casa', 'qasa', 'caza', "Delante de a, el sonido /k/ se escribe con «c»."],
        ['_uaderno', 'c', 'cuaderno', 'quaderno', 'cuadernoo', "Delante de ua, el sonido /k/ se escribe con «c»."],
        ['bos__e', 'qu', 'bosque', 'bosce', 'bosqe', "La sílaba «que» se escribe con «qu»."]
    ];
    const orthographyG = [
        ['pira__ista', 'gü', 'piragüista', 'piraguista', 'piragüixta', 'La u suena en güe/güi, por eso lleva diéresis.'],
        ['ci__eña', 'gü', 'cigüeña', 'cigueña', 'cigüena', 'La u suena en güe, por eso lleva diéresis.'],
        ['man__era', 'gu', 'manguera', 'manguüera', 'mangera', 'En gue la u no suena y no lleva diéresis.'],
        ['á__ila', 'gu', 'águila', 'ágila', 'ágüila', 'La u no suena en gui: se escribe gu.'],
        ['pin__ino', 'gü', 'pingüino', 'pinguino', 'pingüina', 'En güi la u suena y lleva diéresis.'],
        ['ver__enza', 'gü', 'vergüenza', 'verguenza', 'vergüensa', 'En güe la u suena y lleva diéresis.'],
        ['__itarra', 'gu', 'guitarra', 'gitarra', 'güitarra', 'La u no suena en gui: se escribe gu.'],
        ['ho__era', 'gu', 'hoguera', 'hogüera', 'hogera', 'En gue la u no suena y no lleva diéresis.']
    ];
    const orthographyMbMp = [
        ['so__ra', 'mb', 'sombra', 'somra', 'sonbra', 'Antes de b y p se escribe m, no n.'],
        ['ta__or', 'mb', 'tambor', 'tanbor', 'tambór', 'Antes de b se escribe m.'],
        ['co__ra', 'mp', 'compra', 'conpra', 'compre', 'Antes de p se escribe m.'],
        ['lá__ara', 'mp', 'lámpara', 'lánpara', 'lampara', 'Antes de p se escribe m y la primera a lleva tilde.'],
        ['bo__illa', 'mb', 'bombilla', 'bonbilla', 'bombiña', 'Antes de b se escribe m.'],
        ['ca__o', 'mp', 'campo', 'canpo', 'campó', 'Antes de p se escribe m.'],
        ['cu__re', 'mb', 'cumbre', 'cunbre', 'cumbré', 'Antes de b se escribe m.'],
        ['te__rano', 'mp', 'temprano', 'tenprano', 'tempráno', 'Antes de p se escribe m.']
    ];
    const orthographyZC = [
        ['auda_', 'z', 'audaz', 'audac', 'auadaz', 'Al final se escribe z en el singular audaz.'],
        ['pe_', 'z', 'pez', 'pec', 'pes', 'Al final de pez se escribe z; su plural es peces.'],
        ['felici_ad', 'd', 'felicidad', 'felicizad', 'felisidad', 'Felicidad termina en d porque su plural es felicidades.'],
        ['lu_', 'z', 'luz', 'lus', 'lús', 'Al final de luz se escribe z; su plural es luces.'],
        ['verda_', 'd', 'verdad', 'verdaz', 'verdád', 'Verdad termina en d porque su plural es verdades.'],
        ['amista_', 'd', 'amistad', 'amistaz', 'amistád', 'Amistad termina en d porque su plural es amistades.'],
        ['nari_', 'z', 'nariz', 'narid', 'naris', 'Nariz termina en z; su plural es narices.'],
        ['pare_', 'd', 'pared', 'parez', 'paréd', 'Pared termina en d porque su plural es paredes.']
    ];
    const capitals = [
        ['el lunes iré a madrid', 'El lunes iré a Madrid.', 'Madrid es un nombre propio y la oración comienza con mayúscula.'],
        ['mi amiga oona vive en sevilla', 'Mi amiga Oona vive en Sevilla.', 'Los nombres de personas y ciudades llevan mayúscula.'],
        ['el río guadalquivir pasa por córdoba', 'El río Guadalquivir pasa por Córdoba.', 'Los nombres propios se escriben con mayúscula.'],
        ['israel visitó granada', 'Israel visitó Granada.', 'Los nombres de personas y ciudades se escriben con mayúscula.'],
        ['el martes marco fue a toledo', 'El martes Marco fue a Toledo.', 'La oración, el nombre Marco y Toledo llevan mayúscula.'],
        ['carmen leyó sobre el río ebro', 'Carmen leyó sobre el río Ebro.', 'Carmen y Ebro son nombres propios.'],
        ['marta volverá en septiembre', 'Marta volverá en septiembre.', 'Marta empieza con mayúscula; septiembre no.'],
        ['adrián vive en murcia', 'Adrián vive en Murcia.', 'Adrián y Murcia son nombres propios.']
    ];
    const wordRelations = [
        ['sinónimo', 'contento', 'alegre', 'Un sinónimo significa lo mismo o algo parecido.'],
        ['sinónimo', 'rápido', 'veloz', 'Rápido y veloz expresan ideas parecidas.'],
        ['antónimo', 'alto', 'bajo', 'Alto y bajo son ideas contrarias.'],
        ['antónimo', 'encender', 'apagar', 'Encender y apagar tienen significados opuestos.'],
        ['sinónimo', 'frío', 'helado', 'Frío y helado expresan temperatura baja.'],
        ['antónimo', 'abrir', 'cerrar', 'Abrir y cerrar son acciones contrarias.'],
        ['sinónimo', 'enorme', 'gigante', 'Enorme y gigante indican gran tamaño.'],
        ['antónimo', 'duro', 'blando', 'Duro y blando expresan cualidades opuestas.']
    ];
    const syllables = [
        ['sol', 'monosílaba', 'Sol tiene una sola sílaba.'],
        ['casa', 'bisílaba', 'Ca-sa tiene dos sílabas.'],
        ['camisa', 'trisílaba', 'Ca-mi-sa tiene tres sílabas.'],
        ['mariposa', 'polisílaba', 'Ma-ri-po-sa tiene cuatro sílabas.'],
        ['árbol', 'llana', 'Árbol es llana y lleva tilde por terminar en consonante distinta de n o s.'],
        ['café', 'aguda', 'Café es aguda y lleva tilde por terminar en vocal.'],
        ['ratón', 'aguda', 'Ra-tón tiene dos sílabas y la fuerza está en la última.'],
        ['música', 'esdrújula', 'Mú-si-ca tiene la fuerza en la antepenúltima sílaba.']
    ];
    const grammar = [
        ['Escribe el plural de «libro».', 'libros', 'En singular se dice libro; en plural, libros.'],
        ['Escribe el femenino de «actor».', 'actriz', 'El femenino de actor es actriz.'],
        ['Sustituye «Marta» en: Marta corre rápido.', 'Ella', 'Ella es el pronombre personal adecuado.'],
        ['Sustituye «Adrián y tú» por un pronombre.', 'Vosotros', 'Adrián y tú forman la segunda persona del plural.'],
        ['Escribe el plural de «dragón».', 'dragones', 'En plural, dragón cambia y conserva la n.'],
        ['¿«Lyam y yo» se sustituye por qué pronombre?', 'Nosotros', 'La primera persona del plural incluye a la persona que habla.'],
        ['Sustituye «Oona» en: Oona mira el mapa.', 'Ella', 'Ella sustituye al nombre Oona sin cambiar el sentido.'],
        ['Escribe el plural de «pez».', 'peces', 'Pez cambia z por c antes de es en plural.']
    ];
    const adjectives = [
        ['El perro es rápido.', 'rápido', 'El adjetivo rápido describe cómo es el perro.'],
        ['Las casas son altas.', 'altas', 'Altas concuerda en género femenino y número plural con casas.'],
        ['La flor tiene un color brillante.', 'brillante', 'Brillante describe una cualidad de la flor.'],
        ['Los niños están alegres.', 'alegres', 'Alegres concuerda en plural con niños.'],
        ['La puerta está cerrada.', 'cerrada', 'Cerrada concuerda con puerta.'],
        ['Un dragón enorme apareció.', 'enorme', 'Enorme expresa una cualidad del dragón.'],
        ['Las piedras eran redondas.', 'redondas', 'Redondas concuerda con piedras.'],
        ['El mapa era antiguo.', 'antiguo', 'Antiguo describe el mapa.']
    ];
    const verbs = [
        ['Ayer los niños jugaron en el parque.', 'jugaron', 'pasado', 'Jugaron indica una acción ya realizada.'],
        ['Ahora Hugo escribe una carta.', 'escribe', 'presente', 'Escribe indica una acción que ocurre ahora.'],
        ['Mañana visitaremos el museo.', 'visitaremos', 'futuro', 'Visitaremos indica una acción que ocurrirá.'],
        ['La jirafa come hojas.', 'come', 'presente', 'Come expresa una acción que ocurre en el presente.'],
        ['Ayer Oona encontró la llave.', 'encontró', 'pasado', 'Encontró expresa una acción terminada.'],
        ['Mañana Israel resolverá el enigma.', 'resolverá', 'futuro', 'Resolverá expresa una acción que ocurrirá.'],
        ['Ahora Mouna lee la pista.', 'lee', 'presente', 'Lee expresa una acción presente.'],
        ['Kiko abrió el cofre ayer.', 'abrió', 'pasado', 'Abrió indica una acción ya realizada.']
    ];
    const sentenceTypes = [
        ['¿Dónde está la biblioteca?', 'interrogativa', 'Las preguntas usan signos de interrogación.'],
        ['¡Qué hermosa es la estrella!', 'exclamativa', 'Las exclamaciones expresan sorpresa o emoción y usan ¡!.'],
        ['El dragón vive en la montaña.', 'enunciativa', 'Las oraciones enunciativas cuentan o afirman algo.'],
        ['No debemos tirar basura al suelo.', 'enunciativa', 'Esta oración afirma una idea con forma negativa.'],
        ['¿Quién encontró el mapa?', 'interrogativa', 'Pregunta quién realizó la acción.'],
        ['¡Hemos abierto la puerta!', 'exclamativa', 'Expresa una emoción intensa.'],
        ['Marta guarda las llaves.', 'enunciativa', 'La oración informa de una acción.'],
        ['Cerrad el cofre, por favor.', 'imperativa', 'La oración pide que se realice una acción.']
    ];
    const punctuation = [
        ['_Dónde está el mapa?', '¿', 'Las preguntas directas empiezan con el signo de apertura ¿.'],
        ['¡Qué bonito_', '!', 'Las exclamaciones se cierran con el signo ! y comienzan con ¡.'],
        ['Compré pan_ leche y queso.', ',', 'La coma separa elementos de una enumeración.'],
        ['El bosque está lejos_', '.', 'El punto señala el final de una oración enunciativa.'],
        ['Llegaron Israel_ Marta y Oona.', ',', 'La coma separa nombres en una enumeración.'],
        ['_Cuántas pistas quedan?', '¿', 'La pregunta comienza con un signo de apertura.'],
        ['¡Qué gran descubrimiento_', '!', 'La exclamación termina con !.'],
        ['La clase resolvió el misterio_', '.', 'El punto termina la oración.']
    ];
    const wordFamilies = [
        ['panadero', 'pan', 'Panadero deriva de la palabra primitiva pan.'],
        ['florero', 'flor', 'Florero deriva de la palabra primitiva flor.'],
        ['marino', 'mar', 'Marino pertenece a la familia léxica de mar.'],
        ['librería', 'libro', 'Librería deriva de la palabra primitiva libro.'],
        ['caserón', 'casa', 'Caserón deriva de casa.'],
        ['jardinero', 'jardín', 'Jardinero pertenece a la familia de jardín.'],
        ['cazador', 'caza', 'Cazador deriva de caza.'],
        ['pescador', 'pez', 'Pescador pertenece a la familia de pez.']
    ];
    const cohesion = [
        ['El gato duerme. _ ronronea.', 'Él', 'El pronombre Él sustituye al sustantivo gato y evita la repetición.'],
        ['Completa con un conector: Marta llegó tarde _ había perdido el autobús.', 'porque', 'Porque explica la causa de haber llegado tarde.'],
        ['Ordena con 1, 2 y 3: Preparó la mochila. Se levantó temprano. Fue al colegio.', '2, 1, 3', 'Primero se levanta, después prepara la mochila y finalmente va al colegio.'],
        ['Evita repetir «niño»: «El niño juega. El niño sonrió». Sustituye la segunda aparición por un pronombre.', 'Él', 'El pronombre Él sustituye al sustantivo niño.'],
        ['Marta leyó la pista. _ abrió el cofre.', 'Después', 'Después ordena dos acciones en el tiempo.'],
        ['Oona buscó la llave _ no la encontró.', 'pero', 'Pero une dos ideas que contrastan.'],
        ['Marco tenía el mapa. _ sabía la ruta.', 'Por eso', 'Por eso expresa una consecuencia.'],
        ['Adrián encontró una nota. La nota era azul. Sustituye «La nota» por un pronombre.', 'Ella', 'Ella sustituye a «la nota» y evita repetirla.']
    ];

    function writtenQuestion(strategyId, prompt, answer, step, explanation) {
        return { strategyId, prompt, answer, options: null, activityType: 'written', paso1: step, paso2: explanation };
    }

    function selectionQuestion(strategyId, prompt, answer, alternatives, step, explanation) {
        return {
            strategyId,
            prompt,
            answer,
            options: shuffle(unique([answer, ...alternatives]).filter(item => item !== 'palabra').slice(0, 3)),
            activityType: 'select',
            paso1: step,
            paso2: explanation
        };
    }

    function dragQuestion(strategyId, prompt, answer, alternatives, step, explanation) {
        return {
            strategyId,
            prompt,
            answer,
            options: shuffle(unique([answer, ...alternatives]).filter(item => item !== 'palabra').slice(0, 4)),
            activityType: 'drag',
            paso1: step,
            paso2: explanation
        };
    }

    function spellingQuestion(strategyId, options) {
        const pools = {
            1: orthographyCQu,
            2: orthographyG,
            13: orthographyMbMp,
            14: orthographyZC
        };
        const pool = pools[strategyId];
        const [word, missing, complete, directError, otherError, rule] = pick(pool, options);
        const blank = '_'.repeat(Array.from(missing).length);
        const rebuiltWord = word.replace(blank, missing);
        if (!word.includes(blank) || rebuiltWord !== complete) {
            throw new Error(`La máscara ortográfica no coincide con «${complete}»: «${word}»`);
        }
        const format = ((Number(options.questionNumber ?? options.index) || 1) - 1) % 3;
        if (format === 0) {
            return writtenQuestion(strategyId, `Escribe la palabra completa: «${word}».`, complete, `Completa el hueco con: ${missing}.`, rule);
        }
        if (format === 1) {
            return selectionQuestion(
                strategyId,
                `Elige la palabra escrita correctamente: «${word}».`,
                complete,
                [directError, otherError],
                'Compara todas las letras, las tildes y el hueco.',
                rule
            );
        }
        const letters = strategyId === 1
            ? ['c', 'qu', 'q']
            : strategyId === 2
                ? ['g', 'gu', 'gü']
                : strategyId === 13 ? ['mb', 'mp', 'm'] : ['c', 'd', 'z'];
        return dragQuestion(
            strategyId,
            `Arrastra las letras que completan «${word}».`,
            missing,
            letters,
            'Usa la regla ortográfica de la actividad.',
            rule
        );
    }

    function recoveryItem(items, questionNumber) {
        return items[(questionNumber - 1) % items.length];
    }

    function generateRecovery2ByStrategy(strategyId, questionNumber) {
        switch (Number(strategyId)) {
            case 401: {
                const item = recoveryItem([
                    {
                        prompt: 'CT1 · Lee: «Lume escondió una llave bajo una hoja. Primero miró la puerta; después levantó la hoja». ¿Dónde estaba la llave?',
                        answer: 'bajo una hoja',
                        paso1: 'Busca en el texto el lugar del objeto importante.',
                        paso2: 'La llave estaba bajo una hoja.'
                    },
                    {
                        prompt: 'CT1 · Lee: «El jardín del castillo era pequeño, circular y estaba lleno de flores rojas». ¿De qué color eran las flores?',
                        answer: 'rojas',
                        paso1: 'El texto describe las flores con un color.',
                        paso2: 'Las flores eran rojas.'
                    },
                    {
                        prompt: 'CT1 · Lee: «—¿Traes el mapa? —Sí, lo guardé en la mochila», respondió Marta. ¿Dónde estaba el mapa?',
                        answer: 'en la mochila',
                        paso1: 'Lee la respuesta de Marta al personaje que pregunta.',
                        paso2: 'Marta guardó el mapa en la mochila.'
                    },
                    {
                        prompt: 'CT1 · Lee: «Las luciérnagas producen luz al anochecer. Esta luz les sirve para comunicarse». ¿Para qué usan su luz?',
                        answer: 'para comunicarse',
                        paso1: 'La segunda frase explica la función de la luz.',
                        paso2: 'Las luciérnagas usan la luz para comunicarse.'
                    }
                ], questionNumber);
                return { strategyId: 401, prompt: item.prompt, answer: item.answer, paso1: item.paso1, paso2: item.paso2 };
            }
            case 402: {
                const item = recoveryItem([
                    {
                        prompt: 'CT2 · Elige una palabra sinónima de «alegre». Escribe: contento / cansado / serio.',
                        answer: 'contento',
                        paso1: 'Un sinónimo tiene un significado parecido.',
                        paso2: 'Alegre y contento significan algo parecido.'
                    },
                    {
                        prompt: 'CT2 · Escribe el antónimo de «abrir»: cerrar / mirar / entrar.',
                        answer: 'cerrar',
                        paso1: 'Un antónimo expresa una idea contraria.',
                        paso2: 'Abrir y cerrar son acciones contrarias.'
                    },
                    {
                        prompt: 'CT2 · Completa para que concuerde: «Las _____ son fuertes».',
                        answer: 'dragonas',
                        paso1: 'Las indica femenino y plural.',
                        paso2: 'La forma concordada es «Las dragonas son fuertes».'
                    },
                    {
                        prompt: 'CT2 · ¿La frase «¿Dónde está la llave?» es interrogativa, exclamativa o enunciativa?',
                        answer: 'interrogativa',
                        paso1: 'Observa si pregunta, expresa emoción o informa.',
                        paso2: 'Formula una pregunta, por eso es interrogativa.'
                    }
                ], questionNumber);
                return { strategyId: 402, prompt: item.prompt, answer: item.answer, paso1: item.paso1, paso2: item.paso2 };
            }
            case 403: {
                const item = recoveryItem([
                    {
                        prompt: 'CT2 · Completa la secuencia con un conector temporal: «_____ abrió el pergamino; después leyó la pista».',
                        answer: 'Primero',
                        paso1: 'El conector debe indicar la acción inicial.',
                        paso2: 'La secuencia comienza con «Primero».'
                    },
                    {
                        prompt: 'CT2 · Completa: «Preparó la mochila. _____ salió hacia el castillo». Usa luego o porque.',
                        answer: 'Luego',
                        paso1: 'Busca un conector que ordene las acciones en el tiempo.',
                        paso2: '«Luego» indica que salió después de preparar la mochila.'
                    },
                    {
                        prompt: 'CT2 · ¿Qué signos necesita «_____Qué sorpresa_____»? Responde: signos de interrogación o signos de exclamación.',
                        answer: 'signos de exclamación',
                        paso1: 'La oración expresa sorpresa o emoción.',
                        paso2: 'La exclamación lleva ¡ al principio y ! al final.'
                    },
                    {
                        prompt: 'CT2 · Revisa y escribe correctamente: «marta guardó el mapa».',
                        answer: 'Marta guardó el mapa.',
                        paso1: 'Comprueba mayúscula inicial y punto final.',
                        paso2: '«Marta» empieza con mayúscula y la oración termina con punto.'
                    }
                ], questionNumber);
                return { strategyId: 403, prompt: item.prompt, answer: item.answer, paso1: item.paso1, paso2: item.paso2 };
            }
            default: {
                return {
                    strategyId: 401,
                    prompt: 'CT1 · Lee: «La llave estaba bajo el cojín». ¿Dónde estaba la llave?',
                    answer: 'bajo el cojín',
                    paso1: 'Busca la información exacta sobre el lugar.',
                    paso2: 'La llave estaba bajo el cojín.'
                };
            }
        }
    }

    function generateByStrategy(strategyId, options = {}) {
        const id = Number(strategyId);
        const requestedQuestion = Number(options.questionNumber ?? options.index);
        const questionNumber = Number.isInteger(requestedQuestion)
            ? Math.min(20, Math.max(1, requestedQuestion))
            : ((questionCounters[id] || 0) % 20) + 1;
        questionCounters[id] = questionNumber;
        const settings = { ...options, questionNumber };
        if (id >= 401 && id <= 403) {
            return generateRecovery2ByStrategy(id, questionNumber);
        }
        if ([1, 2, 13, 14].includes(id)) return spellingQuestion(id, settings);
        if (id === 3) {
            const [text, answer, rule] = pick(capitals, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(3, `Escribe correctamente: «${text}».`, answer, 'Revisa el comienzo de la oración y los nombres propios.', rule);
            if (format === 1) return selectionQuestion(3, '¿Qué oración está escrita correctamente?', answer, [text, text.replace(answer.split(' ').slice(-1)[0], 'madrid')], 'Revisa mayúsculas y nombres propios.', rule);
            const firstLetter = text.charAt(0).toUpperCase();
            return dragQuestion(3, `Arrastra la mayúscula necesaria al comienzo: «${text}».`, firstLetter, ['A', 'B', 'M', 'S'], 'La primera palabra de la oración comienza en mayúscula.', rule);
        }
        if (id === 4) {
            const [kind, word, answer, explanation] = pick(wordRelations, settings);
            const alternatives = kind === 'sinónimo'
                ? ['lento', 'triste', 'feo']
                : ['grande', 'encender', 'alegre'];
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(4, `Escribe un ${kind} de «${word}».`, answer, kind === 'sinónimo' ? 'Busca una palabra de significado parecido.' : 'Busca una palabra de significado contrario.', explanation);
            if (format === 1) return selectionQuestion(4, `Elige el ${kind} de «${word}».`, answer, alternatives, 'Compara significado y tipo de relación.', explanation);
            return dragQuestion(4, `Arrastra el ${kind} de «${word}» al recuadro.`, answer, alternatives, 'Piensa en parecido o contrario.', explanation);
        }
        if (id === 5) {
            const [word, answer, explanation] = pick(syllables, settings);
            const isStress = ['llana', 'aguda'].includes(answer);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(5, isStress ? `¿Qué tipo de acentuación tiene «${word}»: aguda, llana o esdrújula?` : `Clasifica «${word}» por sus sílabas.`, answer, 'Separa la palabra en sílabas y observa cuál recibe la fuerza.', explanation);
            if (format === 1) return selectionQuestion(5, `Selecciona la clasificación de «${word}».`, answer, isStress ? ['llana', 'aguda', 'esdrújula'] : ['monosílaba', 'bisílaba', 'trisílaba', 'polisílaba'], 'Separa la palabra en sílabas.', explanation);
            return dragQuestion(5, `Arrastra la clasificación correcta de «${word}».`, answer, isStress ? ['llana', 'aguda', 'esdrújula'] : ['monosílaba', 'bisílaba', 'trisílaba', 'polisílaba'], 'Cuenta las sílabas o observa la acentuación.', explanation);
        }
        if (id === 6) {
            const [prompt, answer, explanation] = pick(grammar, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(6, prompt, answer, 'Piensa si el sustantivo o pronombre debe concordar en género, número o persona.', explanation);
            if (format === 1) return selectionQuestion(6, prompt, answer, [answer === 'libros' ? 'libro' : 'libros', 'ella', 'ellos'], 'Revisa género, número o sustitución.', explanation);
            return dragQuestion(6, `Arrastra la respuesta correcta: ${prompt}`, answer, ['libros', 'libro', 'ella', 'ellos'], 'La palabra debe concordar.', explanation);
        }
        if (id === 7) {
            const [text, answer, explanation] = pick(adjectives, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(7, `Escribe el adjetivo de la oración: «${text}».`, answer, 'Busca la palabra que expresa una cualidad o característica.', explanation);
            if (format === 1) return selectionQuestion(7, `Selecciona el adjetivo de «${text}».`, answer, ['grande', 'dulce', 'azul'], 'Un adjetivo expresa una cualidad.', explanation);
            return dragQuestion(7, `Arrastra el adjetivo de «${text}» al recuadro.`, answer, ['grande', 'dulce', 'azul'], 'Busca la cualidad del sustantivo.', explanation);
        }
        if (id === 8) {
            const [text, answer, tense, explanation] = pick(verbs, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(8, `Escribe el verbo y el tiempo verbal de la oración: «${text}».`, `${answer}, ${tense}`, `Localiza la acción y piensa si ocurre en pasado, presente o futuro: ${answer}.`, `${explanation} Respuesta: ${answer} (${tense}).`);
            if (format === 1) return selectionQuestion(8, `¿Qué tiempo verbal expresa el verbo de «${text}»?`, tense, ['pasado', 'presente', 'futuro'], `Localiza la acción: ${answer}.`, explanation);
            return dragQuestion(8, `Arrastra el tiempo del verbo «${answer}».`, tense, ['pasado', 'presente', 'futuro'], 'Observa si indica antes, ahora o después.', explanation);
        }
        if (id === 9) {
            const [text, answer, explanation] = pick(sentenceTypes, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(9, `Clasifica la oración: «${text}».`, answer, 'Observa la intención y los signos de puntuación.', explanation);
            if (format === 1) return selectionQuestion(9, `¿Qué tipo de oración es «${text}»?`, answer, ['enunciativa', 'interrogativa', 'exclamativa'], 'Observa la intención y los signos.', explanation);
            return dragQuestion(9, `Arrastra el tipo de oración: «${text}».`, answer, ['enunciativa', 'interrogativa', 'exclamativa'], 'La modalidad depende de lo que expresa.', explanation);
        }
        if (id === 10) {
            const [text, answer, explanation] = pick(punctuation, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(10, `Completa con el signo de puntuación adecuado: «${text}».`, answer, 'Observa si la oración pregunta, exclama, enumera o termina.', explanation);
            if (format === 1) return selectionQuestion(10, `Selecciona el signo adecuado para «${text}».`, answer, ['.', ',', '¿', '!'], 'Relaciona el signo con la intención.', explanation);
            return dragQuestion(10, `Arrastra el signo adecuado: «${text}».`, answer, ['.', ',', '¿', '!'], 'Preguntar, exclamar, separar o terminar.', explanation);
        }
        if (id === 11) {
            const [derivative, primitive, explanation] = pick(wordFamilies, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(11, `¿Cuál es la palabra primitiva de «${derivative}»?`, primitive, 'La palabra primitiva no procede de otra palabra de su familia.', explanation);
            if (format === 1) return selectionQuestion(11, `Elige la palabra primitiva de «${derivative}».`, primitive, ['flor', 'mar', 'libro', 'pan'], 'Busca la palabra más simple de la familia.', explanation);
            return dragQuestion(11, `Arrastra la palabra primitiva de «${derivative}».`, primitive, ['flor', 'mar', 'libro', 'pan'], 'No debe llevar una derivación visible.', explanation);
        }
        if (id === 12) {
            const [prompt, answer, explanation] = pick(cohesion, settings);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(12, prompt, answer, 'Busca el signo, conector o pronombre que une y organiza las ideas.', explanation);
            if (format === 1) return selectionQuestion(12, prompt, answer, ['porque', 'pero', 'Él', '2, 1, 3'], 'El elemento debe unir las ideas con sentido.', explanation);
            return dragQuestion(12, `Arrastra el elemento que completa: ${prompt}`, answer, ['porque', 'pero', 'Él', '2, 1, 3'], 'El conector, pronombre o orden debe mantener el sentido.', explanation);
        }
        return generateRecovery2ByStrategy(0, questionNumber);
    }

    const stories = [
        {
            id: 1,
            title: 'El enigma de la torre norte',
            paragraphs: [
                { text: 'Marco subió los cuarenta escalones de la torre. La noche era muy oscura y solo se oía el viento. Sobre la mesa había cajas de hierro, bronce y madera. El búho observaba desde la ventana.', prompt: '¿De qué material NO era ninguna de las cajas?', options: ['Oro', 'Bronce', 'Hierro'], answer: 'Oro', paso1: 'Revisa la lista exacta de materiales.', paso2: 'No había ninguna caja de oro.' },
                { text: 'El búho indicó que tocara la caja de bronce y dejara la de hierro. Marco vio que la caja recomendada tenía un candado rojo. Dentro del candado estaba grabada una estrella.', prompt: '¿De qué color era el candado?', options: ['Rojo', 'Azul', 'Dorado'], answer: 'Rojo', paso1: 'La caja de bronce tenía el candado rojo.', paso2: 'La respuesta aparece junto al material de la caja.' },
                { text: 'Marco buscó entre cuatro llaves. Eligió la que tenía forma de estrella y la giró dos veces a la derecha. Al segundo giro se escuchó un clic. La caja se abrió lentamente.', prompt: '¿Cuántas veces giró Marco la llave?', options: ['Dos veces', 'Tres veces', 'Una vez'], answer: 'Dos veces', paso1: 'Localiza la acción que realizó con la llave.', paso2: 'La giró dos veces a la derecha.' },
                { text: 'Dentro de la caja había una piedra brillante. La piedra proyectó un mapa de luz verde sobre la pared. El mapa señalaba el Gran Bosque de las Esmeraldas.', prompt: '¿Qué color tenía el mapa de luz?', options: ['Verde', 'Azul', 'Dorado'], answer: 'Verde', paso1: 'La piedra proyectó un color concreto en la pared.', paso2: 'El mapa de luz era verde.' }
            ]
        },
        {
            id: 2,
            title: 'La llave de cristal',
            paragraphs: [
                { text: 'Oona encontró un cofre en el estanque azul. Estaba amarrado con una cadena de plata. Una estatua de duende sostenía una antorcha en la mano izquierda.', prompt: '¿En qué mano estaba la antorcha?', options: ['Mano izquierda', 'Mano derecha', 'En las dos manos'], answer: 'Mano izquierda', paso1: 'Busca la mano indicada al final del párrafo.', paso2: 'La antorcha estaba en la mano izquierda.' },
                { text: 'La estatua pidió una palabra que rimara con «castillo». Oona pensó en sombrero, dragón y ladrillo. La última palabra terminó igual que castillo, así que la pronunció.', prompt: '¿Qué palabra rimaba con «castillo»?', options: ['Ladrillo', 'Sombrero', 'Dragón'], answer: 'Ladrillo', paso1: 'Compara las terminaciones de las tres palabras.', paso2: 'Ladrillo rima con castillo.' },
                { text: 'La cadena desapareció. El cofre mostraba los números 5, 8 y 2 y una frase que ordenaba sumarlos. Oona calculó la cantidad antes de tocar la tapa.', prompt: '¿Qué número obtuvo al sumar 5, 8 y 2?', options: ['15', '14', '16'], answer: '15', paso1: '5 + 8 = 13; después añade 2.', paso2: 'El resultado correcto es 15.' },
                { text: 'Dentro del cofre Oona encontró una flauta de cristal. Al tocarla aparecieron notas musicales de colores. El portal secreto del castillo comenzó a iluminarse.', prompt: '¿Qué objeto había dentro del cofre?', options: ['Una flauta de cristal', 'Una moneda de oro', 'Un mapa'], answer: 'Una flauta de cristal', paso1: 'Busca el objeto que Oona encontró dentro.', paso2: 'Era una flauta de cristal.' }
            ]
        }
    ];

    function getMysteryParagraph(storyId, paragraphIndex) {
        const story = stories.find(item => item.id === Number(storyId)) || stories[0];
        const index = Math.min(Math.max(Number(paragraphIndex) || 0, 0), story.paragraphs.length - 1);
        return {
            storyTitle: story.title,
            paragraphNumber: index + 1,
            totalParagraphs: story.paragraphs.length,
            ...story.paragraphs[index]
        };
    }

    window.DragonApp.GeneratorLengua = {
        generateByStrategy,
        getMysteryParagraph,
        getMysteryStoriesList: () => stories.map(({ id, title }) => ({ id, title }))
    };
})();

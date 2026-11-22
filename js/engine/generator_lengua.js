window.DragonApp = window.DragonApp || {};

(function () {
    const pick = values => values[Math.floor(Math.random() * values.length)];
    const shuffle = values => [...values].sort(() => Math.random() - 0.5);
    const unique = values => [...new Set(values)];
    const orthographyCQu = [
        ['mos_ito', 'qu', 'mosquito', "Delante de e o i, el sonido /k/ se escribe con «qu»."],
        ['má_ina', 'qu', 'máquina', "Delante de i, el sonido /k/ se escribe con «qu»."],
        ['cara_ol', 'c', 'caracol', "Delante de a, o o u, el sonido /k/ se escribe con «c»."],
        ['es_eleto', 'qu', 'esqueleto', "La sílaba «que» se escribe con «qu»."]
    ];
    const orthographyG = [
        ['pira_ista', 'gü', 'piragüista', 'La u suena en güe/güi, por eso lleva diéresis.'],
        ['ci_üeña', 'gü', 'cigüeña', 'La u suena en güe, por eso lleva diéresis.'],
        ['man_era', 'gu', 'manguera', 'En gue y gui la u no suena y no lleva diéresis.'],
        ['á_ila', 'gu', 'águila', 'La u no suena en gui: se escribe gu.']
    ];
    const capitals = [
        ['el lunes iré a madrid', 'El lunes iré a Madrid.', 'Madrid es un nombre propio y la oración comienza con mayúscula.'],
        ['mi amiga sara vive en sevilla', 'Mi amiga Sara vive en Sevilla.', 'Los nombres de personas y ciudades llevan mayúscula.'],
        ['el río guadalquivir pasa por córdoba', 'El río Guadalquivir pasa por Córdoba.', 'Los nombres propios se escriben con mayúscula.']
    ];
    const wordRelations = [
        ['sinónimo', 'contento', 'alegre', 'Un sinónimo significa lo mismo o algo parecido.'],
        ['sinónimo', 'rápido', 'veloz', 'Rápido y veloz expresan ideas parecidas.'],
        ['antónimo', 'alto', 'bajo', 'Alto y bajo son ideas contrarias.'],
        ['antónimo', 'encender', 'apagar', 'Encender y apagar tienen significados opuestos.']
    ];
    const syllables = [
        ['sol', 'monosílaba', 'Sol tiene una sola sílaba.'],
        ['casa', 'bisílaba', 'Ca-sa tiene dos sílabas.'],
        ['camisa', 'trisílaba', 'Ca-mi-sa tiene tres sílabas.'],
        ['mariposa', 'polisílaba', 'Ma-ri-po-sa tiene cuatro sílabas.'],
        ['árbol', 'llana', 'Árbol es llana y lleva tilde por terminar en consonante distinta de n o s.'],
        ['café', 'aguda', 'Café es aguda y lleva tilde por terminar en vocal.']
    ];
    const grammar = [
        ['Escribe el plural de «libro».', 'libros', 'En singular se dice libro; en plural, libros.'],
        ['Escribe el femenino de «actor».', 'actriz', 'El femenino de actor es actriz.'],
        ['Sustituye «Lucía» en: Lucía corre rápido.', 'Ella', 'Ella es el pronombre personal adecuado.'],
        ['Sustituye «Carlos y tú» por un pronombre.', 'Vosotros', 'Carlos y tú forman la segunda persona del plural.']
    ];
    const adjectives = [
        ['El perro es rápido.', 'rápido', 'El adjetivo rápido describe cómo es el perro.'],
        ['Las casas son altas.', 'altas', 'Altas concuerda en género femenino y número plural con casas.'],
        ['La flor tiene un color brillante.', 'brillante', 'Brillante describe una cualidad de la flor.'],
        ['Los niños están alegres.', 'alegres', 'Alegres concuerda en plural con niños.']
    ];
    const verbs = [
        ['Ayer los niños jugaron en el parque.', 'jugaron', 'pasado', 'Jugaron indica una acción ya realizada.'],
        ['Ahora Leo escribe una carta.', 'escribe', 'presente', 'Escribe indica una acción que ocurre ahora.'],
        ['Mañana visitaremos el museo.', 'visitaremos', 'futuro', 'Visitaremos indica una acción que ocurrirá.'],
        ['La jirafa come hojas.', 'come', 'presente', 'Come expresa una acción que ocurre en el presente.']
    ];
    const sentenceTypes = [
        ['¿Dónde está la biblioteca?', 'interrogativa', 'Las preguntas usan signos de interrogación.'],
        ['¡Qué hermosa es la estrella!', 'exclamativa', 'Las exclamaciones expresan sorpresa o emoción y usan ¡!.'],
        ['El dragón vive en la montaña.', 'enunciativa', 'Las oraciones enunciativas cuentan o afirman algo.'],
        ['No debemos tirar basura al suelo.', 'enunciativa', 'Esta oración afirma una idea con forma negativa.']
    ];
    const punctuation = [
        ['_Dónde está el mapa?', '¿', 'Las preguntas directas empiezan con el signo de apertura ¿.'],
        ['¡Qué bonito_', '!', 'Las exclamaciones se cierran con el signo ! y comienzan con ¡.'],
        ['Compré pan_ leche y queso.', ',', 'La coma separa elementos de una enumeración.'],
        ['El bosque está lejos_', '.', 'El punto señala el final de una oración enunciativa.']
    ];
    const wordFamilies = [
        ['panadero', 'pan', 'Panadero deriva de la palabra primitiva pan.'],
        ['florero', 'flor', 'Florero deriva de la palabra primitiva flor.'],
        ['marino', 'mar', 'Marino pertenece a la familia léxica de mar.'],
        ['librería', 'libro', 'Librería deriva de la palabra primitiva libro.']
    ];
    const cohesion = [
        ['El gato duerme. _ ronronea.', 'Él', 'El pronombre Él sustituye al sustantivo gato y evita la repetición.'],
        ['Completa con un conector: Marta llegó tarde _ había perdido el autobús.', 'porque', 'Porque explica la causa de haber llegado tarde.'],
        ['Ordena con 1, 2 y 3: Preparó la mochila. Se levantó temprano. Fue al colegio.', '2, 1, 3', 'Primero se levanta, después prepara la mochila y finalmente va al colegio.'],
        ['Evita repetir «niño»: «El niño juega. El niño sonrió». Sustituye la segunda aparición por un pronombre.', 'Él', 'El pronombre Él sustituye al sustantivo niño.']
    ];

    function writtenQuestion(strategyId, prompt, answer, step, explanation) {
        return { strategyId, prompt, answer, options: null, activityType: 'written', paso1: step, paso2: explanation };
    }

    function selectionQuestion(strategyId, prompt, answer, alternatives, step, explanation) {
        return {
            strategyId,
            prompt,
            answer,
            options: shuffle(unique([answer, ...alternatives]).slice(0, 4)),
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
            options: shuffle(unique([answer, ...alternatives]).slice(0, 4)),
            activityType: 'drag',
            paso1: step,
            paso2: explanation
        };
    }

    function generateByStrategy(strategyId) {
        const id = Number(strategyId);
        if (id === 1) {
            const [word, missing, complete, rule] = pick(orthographyCQu);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(1, `Escribe la palabra completa: «${word}».`, complete, `La letra o letras que faltan son: ${missing}.`, rule);
            if (format === 1) return selectionQuestion(1, `Elige la palabra correcta: «${word}».`, complete, [word.replace('_', ''), complete === 'mosquito' ? 'mocquito' : 'palabra'], 'Fíjate en el grupo c/qu.', rule);
            return dragQuestion(1, `Arrastra la letra que completa «${word}».`, missing, ['c', 'qu', 'q', 'g'], 'Busca el sonido que necesita la palabra.', rule);
        }
        if (id === 2) {
            const [word, missing, complete, rule] = pick(orthographyG);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(2, `Escribe la palabra completa: «${word}».`, complete, `Completa el hueco con: ${missing}.`, rule);
            if (format === 1) return selectionQuestion(2, `Elige la palabra correcta: «${word}».`, complete, [word.replace('_', ''), 'gato', 'guepa'], 'Fíjate en g, gu o gü.', rule);
            return dragQuestion(2, `Arrastra g, gu o gü para completar «${word}».`, missing, ['g', 'gu', 'gü', 'c'], 'La u puede sonar o llevar diéresis.', rule);
        }
        if (id === 3) {
            const [text, answer, rule] = pick(capitals);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(3, `Escribe correctamente: «${text}».`, answer, 'Revisa el comienzo de la oración y los nombres propios.', rule);
            if (format === 1) return selectionQuestion(3, '¿Qué oración está escrita correctamente?', answer, [text, text.replace(answer.split(' ').slice(-1)[0], 'madrid')], 'Revisa mayúsculas y nombres propios.', rule);
            const firstLetter = text.charAt(0).toUpperCase();
            return dragQuestion(3, `Arrastra la mayúscula necesaria al comienzo: «${text}».`, firstLetter, ['A', 'B', 'M', 'S'], 'La primera palabra de la oración comienza en mayúscula.', rule);
        }
        if (id === 4) {
            const [kind, word, answer, explanation] = pick(wordRelations);
            const alternatives = kind === 'sinónimo'
                ? ['lento', 'triste', 'feo']
                : ['grande', 'encender', 'alegre'];
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(4, `Escribe un ${kind} de «${word}».`, answer, kind === 'sinónimo' ? 'Busca una palabra de significado parecido.' : 'Busca una palabra de significado contrario.', explanation);
            if (format === 1) return selectionQuestion(4, `Elige el ${kind} de «${word}».`, answer, alternatives, 'Compara significado y tipo de relación.', explanation);
            return dragQuestion(4, `Arrastra el ${kind} de «${word}» al recuadro.`, answer, alternatives, 'Piensa en parecido o contrario.', explanation);
        }
        if (id === 5) {
            const [word, answer, explanation] = pick(syllables);
            const isStress = ['llana', 'aguda'].includes(answer);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(5, isStress ? `¿Qué tipo de acentuación tiene «${word}»: aguda, llana o esdrújula?` : `Clasifica «${word}» por sus sílabas.`, answer, 'Separa la palabra en sílabas y observa cuál recibe la fuerza.', explanation);
            if (format === 1) return selectionQuestion(5, `Selecciona la clasificación de «${word}».`, answer, isStress ? ['llana', 'aguda', 'esdrújula'] : ['monosílaba', 'bisílaba', 'trisílaba', 'polisílaba'], 'Separa la palabra en sílabas.', explanation);
            return dragQuestion(5, `Arrastra la clasificación correcta de «${word}».`, answer, isStress ? ['llana', 'aguda', 'esdrújula'] : ['monosílaba', 'bisílaba', 'trisílaba', 'polisílaba'], 'Cuenta las sílabas o observa la acentuación.', explanation);
        }
        if (id === 6) {
            const [prompt, answer, explanation] = pick(grammar);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(6, prompt, answer, 'Piensa si el sustantivo o pronombre debe concordar en género, número o persona.', explanation);
            if (format === 1) return selectionQuestion(6, prompt, answer, [answer === 'libros' ? 'libro' : 'libros', 'ella', 'ellos'], 'Revisa género, número o sustitución.', explanation);
            return dragQuestion(6, `Arrastra la respuesta correcta: ${prompt}`, answer, ['libros', 'libro', 'ella', 'ellos'], 'La palabra debe concordar.', explanation);
        }
        if (id === 7) {
            const [text, answer, explanation] = pick(adjectives);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(7, `Escribe el adjetivo de la oración: «${text}».`, answer, 'Busca la palabra que expresa una cualidad o característica.', explanation);
            if (format === 1) return selectionQuestion(7, `Selecciona el adjetivo de «${text}».`, answer, ['grande', 'dulce', 'azul'], 'Un adjetivo expresa una cualidad.', explanation);
            return dragQuestion(7, `Arrastra el adjetivo de «${text}» al recuadro.`, answer, ['grande', 'dulce', 'azul'], 'Busca la cualidad del sustantivo.', explanation);
        }
        if (id === 8) {
            const [text, answer, tense, explanation] = pick(verbs);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(8, `Escribe el verbo y el tiempo verbal de la oración: «${text}».`, `${answer}, ${tense}`, `Localiza la acción y piensa si ocurre en pasado, presente o futuro: ${answer}.`, `${explanation} Respuesta: ${answer} (${tense}).`);
            if (format === 1) return selectionQuestion(8, `¿Qué tiempo verbal expresa el verbo de «${text}»?`, tense, ['pasado', 'presente', 'futuro'], `Localiza la acción: ${answer}.`, explanation);
            return dragQuestion(8, `Arrastra el tiempo del verbo «${answer}».`, tense, ['pasado', 'presente', 'futuro'], 'Observa si indica antes, ahora o después.', explanation);
        }
        if (id === 9) {
            const [text, answer, explanation] = pick(sentenceTypes);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(9, `Clasifica la oración: «${text}».`, answer, 'Observa la intención y los signos de puntuación.', explanation);
            if (format === 1) return selectionQuestion(9, `¿Qué tipo de oración es «${text}»?`, answer, ['enunciativa', 'interrogativa', 'exclamativa'], 'Observa la intención y los signos.', explanation);
            return dragQuestion(9, `Arrastra el tipo de oración: «${text}».`, answer, ['enunciativa', 'interrogativa', 'exclamativa'], 'La modalidad depende de lo que expresa.', explanation);
        }
        if (id === 10) {
            const [text, answer, explanation] = pick(punctuation);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(10, `Completa con el signo de puntuación adecuado: «${text}».`, answer, 'Observa si la oración pregunta, exclama, enumera o termina.', explanation);
            if (format === 1) return selectionQuestion(10, `Selecciona el signo adecuado para «${text}».`, answer, ['.', ',', '¿', '!'], 'Relaciona el signo con la intención.', explanation);
            return dragQuestion(10, `Arrastra el signo adecuado: «${text}».`, answer, ['.', ',', '¿', '!'], 'Preguntar, exclamar, separar o terminar.', explanation);
        }
        if (id === 11) {
            const [derivative, primitive, explanation] = pick(wordFamilies);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(11, `¿Cuál es la palabra primitiva de «${derivative}»?`, primitive, 'La palabra primitiva no procede de otra palabra de su familia.', explanation);
            if (format === 1) return selectionQuestion(11, `Elige la palabra primitiva de «${derivative}».`, primitive, ['flor', 'mar', 'libro', 'pan'], 'Busca la palabra más simple de la familia.', explanation);
            return dragQuestion(11, `Arrastra la palabra primitiva de «${derivative}».`, primitive, ['flor', 'mar', 'libro', 'pan'], 'No debe llevar una derivación visible.', explanation);
        }
        if (id === 12) {
            const [prompt, answer, explanation] = pick(cohesion);
            const format = Math.floor(Math.random() * 3);
            if (format === 0) return writtenQuestion(12, prompt, answer, 'Busca el signo, conector o pronombre que une y organiza las ideas.', explanation);
            if (format === 1) return selectionQuestion(12, prompt, answer, ['porque', 'pero', 'Él', '2, 1, 3'], 'El elemento debe unir las ideas con sentido.', explanation);
            return dragQuestion(12, `Arrastra el elemento que completa: ${prompt}`, answer, ['porque', 'pero', 'Él', '2, 1, 3'], 'El conector, pronombre o orden debe mantener el sentido.', explanation);
        }
        return generateByStrategy(1);
    }

    const stories = [
        {
            id: 1,
            title: 'El enigma de la torre norte',
            paragraphs: [
                { text: 'Bruno subió los cuarenta escalones de la torre. La noche era muy oscura y solo se oía el viento. Sobre la mesa había cajas de hierro, bronce y madera. El búho observaba desde la ventana.', prompt: '¿De qué material NO era ninguna de las cajas?', options: ['Oro', 'Bronce', 'Hierro'], answer: 'Oro', paso1: 'Revisa la lista exacta de materiales.', paso2: 'No había ninguna caja de oro.' },
                { text: 'El búho indicó que tocara la caja de bronce y dejara la de hierro. Bruno vio que la caja recomendada tenía un candado rojo. Dentro del candado estaba grabada una estrella.', prompt: '¿De qué color era el candado?', options: ['Rojo', 'Azul', 'Dorado'], answer: 'Rojo', paso1: 'La caja de bronce tenía el candado rojo.', paso2: 'La respuesta aparece junto al material de la caja.' },
                { text: 'Bruno buscó entre cuatro llaves. Eligió la que tenía forma de estrella y la giró dos veces a la derecha. Al segundo giro se escuchó un clic. La caja se abrió lentamente.', prompt: '¿Cuántas veces giró Bruno la llave?', options: ['Dos veces', 'Tres veces', 'Una vez'], answer: 'Dos veces', paso1: 'Localiza la acción que realizó con la llave.', paso2: 'La giró dos veces a la derecha.' },
                { text: 'Dentro de la caja había una piedra brillante. La piedra proyectó un mapa de luz verde sobre la pared. El mapa señalaba el Gran Bosque de las Esmeraldas.', prompt: '¿Qué color tenía el mapa de luz?', options: ['Verde', 'Azul', 'Dorado'], answer: 'Verde', paso1: 'La piedra proyectó un color concreto en la pared.', paso2: 'El mapa de luz era verde.' }
            ]
        },
        {
            id: 2,
            title: 'La llave de cristal',
            paragraphs: [
                { text: 'Maya encontró un cofre en el estanque azul. Estaba amarrado con una cadena de plata. Una estatua de duende sostenía una antorcha en la mano izquierda.', prompt: '¿En qué mano estaba la antorcha?', options: ['Mano izquierda', 'Mano derecha', 'En las dos manos'], answer: 'Mano izquierda', paso1: 'Busca la mano indicada al final del párrafo.', paso2: 'La antorcha estaba en la mano izquierda.' },
                { text: 'La estatua pidió una palabra que rimara con «castillo». Maya pensó en sombrero, dragón y ladrillo. La última palabra terminó igual que castillo, así que la pronunció.', prompt: '¿Qué palabra rimaba con «castillo»?', options: ['Ladrillo', 'Sombrero', 'Dragón'], answer: 'Ladrillo', paso1: 'Compara las terminaciones de las tres palabras.', paso2: 'Ladrillo rima con castillo.' },
                { text: 'La cadena desapareció. El cofre mostraba los números 5, 8 y 2 y una frase que ordenaba sumarlos. Maya calculó la cantidad antes de tocar la tapa.', prompt: '¿Qué número obtuvo al sumar 5, 8 y 2?', options: ['15', '14', '16'], answer: '15', paso1: '5 + 8 = 13; después añade 2.', paso2: 'El resultado correcto es 15.' },
                { text: 'Dentro del cofre Maya encontró una flauta de cristal. Al tocarla aparecieron notas musicales de colores. El portal secreto del castillo comenzó a iluminarse.', prompt: '¿Qué objeto había dentro del cofre?', options: ['Una flauta de cristal', 'Una moneda de oro', 'Un mapa'], answer: 'Una flauta de cristal', paso1: 'Busca el objeto que Maya encontró dentro.', paso2: 'Era una flauta de cristal.' }
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

window.DragonApp = window.DragonApp || {};

(function () {
    const pick = values => values[Math.floor(Math.random() * values.length)];
    const orthographyCQu = [
        ['mos_ito', 'qu', 'mosquito', "Delante de e o i, el sonido /k/ se escribe con «qu»."],
        ['má_ina', 'qu', 'máquina', "Delante de i, el sonido /k/ se escribe con «qu»."],
        ['car_ol', 'c', 'caracol', "Delante de a, o o u, el sonido /k/ se escribe con «c»."],
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

    function writtenQuestion(strategyId, prompt, answer, step, explanation) {
        return { strategyId, prompt, answer, options: null, paso1: step, paso2: explanation };
    }

    function generateByStrategy(strategyId) {
        const id = Number(strategyId);
        if (id === 1) {
            const [word, missing, complete, rule] = pick(orthographyCQu);
            return writtenQuestion(1, `Escribe la palabra completa: «${word}».`, complete, `La letra o letras que faltan son: ${missing}.`, rule);
        }
        if (id === 2) {
            const [word, missing, complete, rule] = pick(orthographyG);
            return writtenQuestion(2, `Escribe la palabra completa: «${word}».`, complete, `Completa el hueco con: ${missing}.`, rule);
        }
        if (id === 3) {
            const [text, answer, rule] = pick(capitals);
            return writtenQuestion(3, `Escribe correctamente: «${text}».`, answer, 'Revisa el comienzo de la oración y los nombres propios.', rule);
        }
        if (id === 4) {
            const [kind, word, answer, explanation] = pick(wordRelations);
            return writtenQuestion(4, `Escribe un ${kind} de «${word}».`, answer, kind === 'sinónimo' ? 'Busca una palabra de significado parecido.' : 'Busca una palabra de significado contrario.', explanation);
        }
        if (id === 5) {
            const [word, answer, explanation] = pick(syllables);
            const isStress = ['llana', 'aguda'].includes(answer);
            return writtenQuestion(5, isStress ? `¿Qué tipo de acentuación tiene «${word}»: aguda, llana o esdrújula?` : `Clasifica «${word}» por sus sílabas.`, answer, 'Separa la palabra en sílabas y observa cuál recibe la fuerza.', explanation);
        }
        if (id === 6) {
            const [prompt, answer, explanation] = pick(grammar);
            return writtenQuestion(6, prompt, answer, 'Piensa si el sustantivo o pronombre debe concordar en género, número o persona.', explanation);
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

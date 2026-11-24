window.DragonApp = window.DragonApp || {};

(function () {
    const fictionNotice = {
        title: 'Una historia de ficción',
        text: '«Crónicas de la Antigua Bañeza: El Secreto del Dragón del Órbigo» es una historia de ficción y fantasía medieval creada con fines educativos para fomentar la lectura comprensiva, el trabajo en equipo y la convivencia. Todos los personajes, clanes mágicos y aventuras son imaginarios y habitan juntos en una versión fantástica de nuestra ciudad, La Bañeza.'
    };

    const chapters = [
        {
            id: 1,
            title: 'Capítulo 1: El pergamino de la Plaza Mayor',
            subtitle: 'Disponible sin restricción',
            text: [
                'Hace muchos siglos, cuando los inviernos eran largos y la nieve cubría los tejados de pizarra, la villa de <strong>La Bañeza</strong> era un cruce de caminos lleno de vida. No había coches ni farolas eléctricas, sino <strong>murallas</strong> de piedra, antorchas encendidas y calles empedradas donde convivían artesanos, feriantes y viajeros de tierras lejanas.',
                'Una mañana fría de noviembre, varios aprendices de la <strong>Academia del Dragón</strong> bajaron desde su torre junto a la iglesia de <strong>Santa María</strong> hasta la <strong>Plaza Mayor</strong>. Allí estaba <strong>Kiko</strong>, al que le encantaba la farándula, hacer malabares y arrancar carcajadas a los vecinos como un auténtico <strong>juglar</strong>, ayudando a <strong>Carmen</strong> y <strong>Hugo</strong> a colocar los carteles del mercado.',
                'De pronto, empezó una pequeña discusión por una tontería: <strong>Hugo</strong> y <strong>Lyam</strong> querían mirar el mapa de la villa al mismo tiempo y hablaban a la vez sin escucharse. <strong>Carmen</strong> levantó entonces una vara de madera tallada —el <strong>bastón de la palabra</strong>— y pidió que solo hablara quien la tuviera en la mano. Enseguida volvió la <strong>concordia</strong> y se escucharon por turnos.',
                'Justo en ese momento, un halcón plateado descendió desde la torre del reloj y dejó caer un <strong>pergamino</strong> enrollado con un sello de cera roja. <strong>Oona</strong> y <strong>Alicia</strong>, dos de las jóvenes <strong>sabias</strong> que pasaban las tardes estudiando libros antiguos en la biblioteca, lo desenrollaron con cuidado.',
                'Al verlo, <strong>Noah</strong>, aprendiz de las <strong>sombras bondadosas</strong> —una magia oscura y profunda que a veces le hacía dibujar figuras sombrías en su cuaderno, pero que él siempre usaba para proteger y ayudar—, frunció el ceño y murmuró enseguida:<br>—Yo no sé...',
                '—Tranquilo, Noah, no hay prisa —le dijo <strong>Oona</strong> con una sonrisa—. Vamos a mirarlo despacio entre todos.',
                'En los bordes del pergamino había estrellas dibujadas y trazos de ríos caudalosos. <strong>Ishak</strong>, que conocía los secretos de los <strong>Guardianes de las Dunas</strong> por las historias de su familia, reconoció enseguida la estrella de ocho puntas que guía a los viajeros de noche. A su lado, <strong>Adrián</strong> —que acababa de llegar hacía poco a la villa junto a <strong>Juan Antonio</strong> y era un apasionado de la astronomía, las estrellas y los misterios del universo— señaló hacia el cielo de la mañana:<br>—¡Esa estrella marca el rumbo hacia el río!',
                'Con un toque suave de sombra protectora, <strong>Noah</strong> hizo que la tinta dorada del centro brillara más para que todos pudieran leer el mensaje:',
                '<blockquote>«Aprendices de todos los caminos: bajo los soportales de esta <strong>Plaza Mayor</strong> y junto a las aguas del río <strong>Órbigo</strong> duerme un antiguo <strong>linaje</strong> de dragones protectores. La llave de su guarida se ha dividido en tres fragmentos. Solo escuchándoos con respeto y sumando vuestros talentos podréis reunirla antes de <strong>Navidad</strong>.»</blockquote>',
                'En una esquina del pergamino aparecía una pequeña cuenta anotada por el escriba del mercado:',
                '<blockquote>«En el puesto del panadero había <strong>10</strong> hogazas en cada cesta. Si en la primera cesta quedan <strong>6</strong> hogazas y en la segunda quedan <strong>3</strong> hogazas, ¿cuántas hogazas faltan en total entre las dos cestas para completar <strong>10</strong> hogazas en cada una?»</blockquote>',
                '<strong>Omar</strong>, el gran matemático del grupo, calculó en un instante junto a <strong>Lyam</strong>:<br>—En la primera cesta faltan <code>10 - 6 = 4</code> hogazas, y en la segunda faltan <code>10 - 3 = 7</code> hogazas. En total faltan <code>4 + 7 = 11</code> hogazas.',
                'Al ver que dividir el problema en dos pasos lo hacía sencillo, <strong>Noah</strong> sonrió animado. ¡La búsqueda acababa de empezar!'
            ],
            glossary: [
                ['Muralla', 'Muro alto y grueso de piedra que rodeaba las ciudades antiguas para protegerlas.'],
                ['Juglar', 'Artista medieval que iba de plaza en plaza contando historias, haciendo juegos y divirtiendo a la gente.'],
                ['Pergamino', 'Piel fina preparada antiguamente para escribir sobre ella antes de que existiera el papel moderno.'],
                ['Linaje', 'Familia o grupo de antepasados muy antiguos que comparten una misma historia.'],
                ['Concordia', 'Convivencia tranquila y respetuosa en la que las personas se escuchan y se entienden.']
            ],
            questions: [
                {
                    prompt: '¿Qué hicieron los aprendices cuando Hugo y Lyam empezaron a hablar a la vez y a discutir?',
                    options: [
                        'Usaron el bastón de la palabra para escucharse por turnos',
                        'Los dejaron hablar sin escucharse',
                        'Abandonaron la Plaza Mayor'
                    ],
                    answer: 'Usaron el bastón de la palabra para escucharse por turnos',
                    paso1: 'Busca qué hizo Carmen para ordenar la conversación.',
                    paso2: 'Usaron el bastón de la palabra para escucharse por turnos y recuperar la concordia.'
                },
                {
                    prompt: '¿Qué afición tiene Adrián, uno de los recién llegados a la villa?',
                    options: [
                        'La astronomía, las estrellas y los misterios del universo',
                        'La cocina y los dulces',
                        'La construcción de puentes'
                    ],
                    answer: 'La astronomía, las estrellas y los misterios del universo',
                    paso1: 'Lee qué le apasiona a Adrián.',
                    paso2: 'La astronomía, las estrellas y los misterios del universo.'
                },
                {
                    prompt: '¿Cuántas hogazas faltaban en total entre las dos cestas?',
                    options: ['11 hogazas', '7 hogazas', '4 hogazas'],
                    answer: '11 hogazas',
                    paso1: 'Calcula por separado las hogazas que faltan en cada cesta.',
                    paso2: 'Faltaban 4 hogazas en la primera cesta y 7 en la segunda: 11 en total.'
                }
            ],
            unlock: {
                math: [1, 3, 200],
                lengua: [1, 3, 4]
            }
        },
        {
            id: 2,
            title: 'Capítulo 2: El puente sobre el río Órbigo',
            subtitle: 'La balanza del molino',
            text: [
                'Con el primer fragmento guardado en su <strong>zurrón</strong>, los aprendices caminaron hacia las afueras de <strong>La Bañeza</strong> medieval hasta el puente de piedra que cruzaba el <strong>río Órbigo</strong>. La niebla flotaba sobre el agua fría.',
                'En mitad del puente esperaba un <strong>centinela</strong> con capa azul y escudo de dos peces plateados. No les dejaba pasar porque la <strong>esclusa</strong> del viejo molino del río se había atascado con ramas y piedras.',
                'De camino surgió un pequeño enfado entre <strong>Marco</strong> y <strong>Marta</strong> por quién sujetaba la cuerda de medición. <strong>Mouna</strong>, que siempre encontraba palabras tranquilas para calmar los ánimos, y <strong>Juan Antonio</strong> —el otro recién llegado a la villa, que observaba todo con curiosidad y buen humor— les recordaron que discutir por una pequeñez solo hacía perder tiempo a todos.',
                'Mientras varios hablaban a la vez buscando soluciones, <strong>Israel</strong>, que hablaba poco pero siempre intervenía en el momento justo con una idea certera, señaló la rueda hidráulica:',
                '—Mirad las poleas: si equilibramos los dos platos de la balanza, el agua empujará la compuerta sola.',
                '<strong>Elisabeth</strong>, que conocía las historias de los <strong>Navegantes del Gran Océano</strong> y cómo leer la fuerza de las corrientes de agua, ayudó a <strong>Ángel</strong> y a <strong>Andrea</strong> a revisar las cadenas.',
                'Para mover la rueda hacía falta equilibrar dos pesas de hierro: un plato tenía <strong>24</strong> kilos y el otro tenía <strong>16</strong> kilos. <strong>Noah</strong> volvió a dudar un segundo —«no sé si me saldrá»—, pero <strong>Omar</strong> (el matemático) y <strong>Romays</strong> le animaron a calcularlo juntos: para igualar los <strong>24</strong> kilos del primer plato hacían falta <code>24 - 16 = 8</code> kilos (que es el doble de <strong>4</strong> kilos).',
                '<strong>Noah</strong> proyectó una sombra suave y firme sobre la palanca para guiar el movimiento sin esfuerzo, mientras <strong>Israel</strong> y <strong>Marta</strong> colocaban la pesa de <strong>8</strong> kilos. La rueda giró, la esclusa se abrió y entre las piedras del arco central brilló el <strong>segundo fragmento</strong> de la llave dorada.'
            ],
            glossary: [
                ['Centinela', 'Soldado o guardián que vigila un puente, una puerta o una torre.'],
                ['Esclusa', 'Compuerta que sirve para abrir o cerrar el paso del agua en un río o canal.'],
                ['Zurrón', 'Bolsa grande de cuero que llevaban los viajeros y pastores colgada al hombro.']
            ],
            questions: [
                {
                    prompt: '¿Cómo es la forma de participar de Israel en el grupo?',
                    options: [
                        'Habla poco, pero interviene en el momento justo con una idea muy acertada',
                        'Habla todo el tiempo y da órdenes',
                        'No participa en las decisiones'
                    ],
                    answer: 'Habla poco, pero interviene en el momento justo con una idea muy acertada',
                    paso1: 'Fíjate en cuándo interviene Israel.',
                    paso2: 'Habla poco, pero interviene en el momento justo con una idea muy acertada.'
                },
                {
                    prompt: '¿Cuántos kilos había que añadir al plato de 16 kilos?',
                    options: ['8 kilos', '4 kilos', '24 kilos'],
                    answer: '8 kilos',
                    paso1: 'Calcula la diferencia entre 24 y 16.',
                    paso2: 'Había que añadir 8 kilos, el doble de 4 kilos.'
                },
                {
                    prompt: '¿Cómo resolvieron el pequeño enfado entre Marco y Marta?',
                    options: [
                        'Mouna y Juan Antonio calmaron los ánimos',
                        'Cada uno sostuvo una cuerda por separado',
                        'Israel abrió la esclusa sin hablar'
                    ],
                    answer: 'Mouna y Juan Antonio calmaron los ánimos',
                    paso1: 'Busca quién recordó al grupo que discutir una pequeñez hace perder tiempo.',
                    paso2: 'Mouna y Juan Antonio calmaron los ánimos y pidieron dejar atrás la discusión.'
                }
            ],
            unlock: {
                math: [2, 10, 15],
                lengua: [5, 12, 1]
            }
        },
        {
            id: 3,
            title: 'Capítulo 3: El misterio del Jardinillo y el viejo Azucarero',
            subtitle: 'La palabra de la luz',
            text: [
                'El tercer fragmento estaba escondido en los jardines amurallados de <strong>El Jardinillo</strong>, muy cerca de la <strong>almena</strong> desde donde se divisaba todo el <strong>páramo</strong> leonés y los campos donde siglos después se levantaría el gran <strong>ingenio</strong> azucarero de la ciudad.',
                'Al entrar en <strong>El Jardinillo</strong>, los árboles tenían escarcha en las ramas. En el centro había un <strong>reloj de sol</strong> rodeado por cuatro estatuas de piedra: un león, un búho, un lobo y un dragón.',
                '<strong>Arianna</strong>, la tercera de las jóvenes <strong>sabias</strong> de la academia junto a <strong>Oona</strong> y <strong>Alicia</strong>, limpió la escarcha de la base del reloj. A su lado, <strong>Adam</strong> —que recordaba cómo los <strong>Mercaderes del Desierto</strong> miden las horas observando la sombra del sol— y <strong>Adrián</strong>, el astrónomo, comprobaron hacia dónde apuntaba la aguja de piedra.',
                'En la losa había una inscripción tallada:',
                '<blockquote>«La sombra señalará el escondite cuando ordenéis estas cuatro palabras según el alfabeto y descubráis cuál es el <strong>antónimo</strong> de <strong>oscuro</strong>.»</blockquote>',
                'Hubo un instante en que <strong>Kiko</strong>, <strong>Arabia</strong> y <strong>Hugo</strong> quisieron responder a la vez, pero <strong>Alicia</strong> pidió respetar el <strong>turno de palabra</strong>. <strong>Arabia</strong> leyó en orden alfabético las cuatro palabras: <em>almena, búho, dragón, luminoso</em>. Después, <strong>Juan Antonio</strong> y <strong>Romays</strong> señalaron que <strong>luminoso</strong> era el <strong>antónimo</strong> de <em>oscuro</em>.',
                'Para celebrar el acierto, <strong>Kiko</strong> improvisó una pequeña reverencia teatral de juglar que hizo reír a todo el jardín. En ese instante, un rayo de sol atravesó las nubes de diciembre e iluminó la boca del dragón de piedra, donde descansaba el <strong>tercer fragmento</strong>.',
                'Al juntar las tres piezas sobre el reloj de sol, <strong>Oona</strong>, <strong>Alicia</strong> y <strong>Arianna</strong> vieron cómo se fundían en una única llave dorada con forma de ala.'
            ],
            glossary: [
                ['Almena', 'Cada uno de los bloques de piedra que coronan lo alto de una muralla o torre medieval.'],
                ['Páramo', 'Terreno llano, alto y abierto, muy típico de las tierras de León.'],
                ['Ingenio', 'Máquina o fábrica antigua donde se transformaban productos del campo, como el azúcar.'],
                ['Antónimo', 'Palabra que significa exactamente lo contrario que otra (por ejemplo, luminoso y oscuro).']
            ],
            questions: [
                {
                    prompt: '¿Quiénes son las tres jóvenes sabias de la academia?',
                    options: ['Oona, Alicia y Arianna', 'Carmen, Marta y Arabia', 'Andrea, Elisabeth y Mouna'],
                    answer: 'Oona, Alicia y Arianna',
                    paso1: 'Busca los nombres que aparecen limpiando y reunidas junto al reloj.',
                    paso2: 'Las tres jóvenes sabias son Oona, Alicia y Arianna.'
                },
                {
                    prompt: '¿Cuál era el antónimo de «oscuro» en la inscripción del reloj de sol?',
                    options: ['Luminoso', 'Sombrío', 'Oscurecido'],
                    answer: 'Luminoso',
                    paso1: 'Busca la palabra contraria a oscuro.',
                    paso2: 'Luminoso era el antónimo de oscuro.'
                },
                {
                    prompt: '¿Qué hicieron cuando varios compañeros quisieron responder a la vez?',
                    options: [
                        'Pidieron respetar el turno de palabra',
                        'Respondieron todos gritando',
                        'Abandonaron El Jardinillo'
                    ],
                    answer: 'Pidieron respetar el turno de palabra',
                    paso1: 'Recuerda cómo Alicia pidió resolver la respuesta.',
                    paso2: 'Pidieron respetar el turno de palabra para escuchar con calma.'
                }
            ],
            unlock: {
                math: [10, 2, 200],
                lengua: [4, 3, 12]
            }
        },
        {
            id: 4,
            title: 'Capítulo 4: Nochebuena en la Torre del Dragón',
            subtitle: 'Cierre antes de las vacaciones de Navidad',
            text: [
                'Había llegado el último día antes de las vacaciones de <strong>Navidad</strong>. Toda <strong>La Bañeza</strong> medieval lucía <strong>guirnaldas</strong> de <strong>acebo</strong>, ramas de pino y faroles encendidos desde la calle <strong>El Reloj</strong> hasta la <strong>Plaza Mayor</strong>.',
                'Todos los aprendices subieron juntos hasta lo alto de la torre de <strong>Santa María</strong>, mezclados en alegre conversación. <strong>Kiko</strong> encabezaba la fila contando chistes de juglar mientras <strong>Israel</strong> sonreía en silencio y vigiaba que nadie tropezara en la escalera de caracol. <strong>Adrián</strong> y <strong>Juan Antonio</strong>, ya plenamente integrados como dos veteranos más de la villa, comentaban las estrellas de invierno junto a <strong>Ishak</strong>, <strong>Adam</strong> y <strong>Mouna</strong>. <strong>Omar</strong> contaba los peldaños de diez en diez con <strong>Lyam</strong>, <strong>Marco</strong> y <strong>Ángel</strong>, mientras <strong>Oona</strong>, <strong>Alicia</strong>, <strong>Arianna</strong>, <strong>Carmen</strong>, <strong>Andrea</strong>, <strong>Marta</strong>, <strong>Arabia</strong>, <strong>Elisabeth</strong>, <strong>Romays</strong> y <strong>Hugo</strong> llevaban los cuadernos del viaje. <strong>Noah</strong> caminaba tranquilo a su lado, iluminando los escalones con una linterna de sombra cálida y amable.',
                'Introdujeron la llave dorada con forma de ala en la puerta de roble y entraron en una sala acogedora con chimenea, estanterías llenas de libros ilustrados y un joven <strong>dragón esmeralda</strong> dormido sobre un cojín de <strong>terciopelo</strong> rojo.',
                'El dragón abrió sus ojos dorados, encendió con una pequeña chispa las velas del árbol de <strong>Navidad</strong> y dejó sobre la mesa un cofre con dulces y un diploma con el nombre de cada aprendiz.',
                '—Habéis demostrado que, cuando escucháis vuestros turnos, resolvéis los pequeños enfados con paz y unís vuestras distintas capacidades, no hay misterio que se os resista —susurró el dragón con voz cálida—. Descansad estas vacaciones de <strong>Navidad</strong> con vuestras familias. En enero, nuevas puertas de <strong>La Bañeza</strong> aguardarán vuestro ingenio.',
                'Salieron de la torre bajo los primeros copos de nieve de diciembre, orgullosos de su clase y sabiendo que su aventura solo acababa de empezar.'
            ],
            glossary: [
                ['Guirnalda', 'Tira hecha con ramas, flores o luces que se cuelga para adornar en fiestas.'],
                ['Acebo', 'Arbusto de hojas verdes brillantes con pinchitos y bolitas rojas muy típico de Navidad.'],
                ['Terciopelo', 'Tela muy suave y tupida al tacto.']
            ],
            questions: [
                {
                    prompt: '¿Qué hacían Kiko e Israel mientras subían por la escalera de caracol?',
                    options: [
                        'Kiko contaba chistes de juglar e Israel vigilaba que nadie tropezara',
                        'Ambos corrían sin mirar',
                        'Kiko dormía e Israel llevaba todos los cuadernos'
                    ],
                    answer: 'Kiko contaba chistes de juglar e Israel vigilaba que nadie tropezara',
                    paso1: 'Fíjate en cómo ayudaban los dos durante la subida.',
                    paso2: 'Kiko contaba chistes de juglar e Israel vigilaba que nadie tropezara.'
                },
                {
                    prompt: '¿Cómo encendió el dragón las velas del árbol de Navidad?',
                    options: ['Soltando una pequeña chispa', 'Con una antorcha', 'Con una linterna'],
                    answer: 'Soltando una pequeña chispa',
                    paso1: 'Relee la escena junto al dragón.',
                    paso2: 'El dragón encendió las velas soltando una pequeña chispa.'
                },
                {
                    prompt: '¿Qué valores destacó el dragón antes de irse de vacaciones de Navidad?',
                    options: [
                        'Escuchar los turnos, resolver enfados con paz y unir las capacidades',
                        'Hablar más alto y ganar siempre',
                        'Trabajar solos sin ayudar'
                    ],
                    answer: 'Escuchar los turnos, resolver enfados con paz y unir las capacidades',
                    paso1: 'Relee el mensaje del dragón.',
                    paso2: 'Destacó escuchar los turnos, resolver los enfados con paz y unir las distintas capacidades.'
                }
            ]
        }
    ];

    window.DragonApp.Story = {
        getFictionNotice: () => fictionNotice,
        getChapters: () => chapters,
        getChapter: id => chapters.find(chapter => chapter.id === Number(id)) || chapters[0]
    };
})();

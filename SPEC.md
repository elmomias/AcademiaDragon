# ESPECIFICACION TECNICA Y FUNCIONAL: Academia del Dragon

## 1. Vision del producto

Aplicacion web educativa SPA, desarrollada con HTML5, CSS3 y JavaScript ES6 sin dependencias externas. Se instala copiando la carpeta del proyecto en cada miniportatil.

El modelo vigente es de un unico alumno por portatil:

- En la primera apertura, el alumno escribe su nombre o apodo.
- El nombre se guarda junto al progreso en `localStorage`.
- No existe seleccion ni censo de 22 alumnos.
- Si se copia la carpeta a otro portatil, el alumno introduce su propio nombre en ese equipo.
- El nombre puede modificarse desde la cabecera o desde el Panel de Profesor.

## 2. Arquitectura y estructura

```text
index.html
css/styles.css
js/app.js
js/services/storage.js
js/engine/generator_math.js
js/engine/generator_lengua.js
```

La aplicacion conserva modulos aislados para almacenamiento y generacion de ejercicios.

## 3. Persistencia local

La clave oficial es `dragon_data_local_v2`.

Datos almacenados:

```javascript
{
    name: String,
    modoRecuperacion: Boolean,
    progresoMath: {},
    progresoLengua: {},
    misterioProgreso: {},
    sesiones: []
}
```

El almacenamiento debe migrar automaticamente formatos antiguos con una propiedad `students` y normalizar el nombre vacio o los marcadores historicos DRAGON 01-22.

## 4. Vistas principales

1. `view-name-input`: registro del alumno.
2. `view-hub`: seleccion entre Matematicas, Lengua e Misterio.
3. `view-category-select`: categorias o lecciones disponibles.
4. `view-practice`: sesion de 20 ejercicios.
5. `view-mystery`: lectura guiada de Misterio.
6. `view-teacher`: gestion local protegida por PIN 5210.

## 5. Navegacion por categorias

Al entrar en una asignatura se muestra su lista de categorias. Al elegir una categoria, todos los ejercicios de esa sesion pertenecen exclusivamente a ella.

Las sesiones tienen exactamente 20 ejercicios.

## 6. Generador matematico

Namespace: `window.DragonApp.GeneratorMath`.

Formato obligatorio:

```javascript
{
    strategyId,
    prompt,
    answer,
    options: null | Array,
    paso1,
    paso2
}
```

Categorias:

- 1 Amigos del 10: seis variantes con incognitas y descomposicion.
- 2 Llegar a la decena: directa, puente y sumando oculto.
- 3 Dobles y mitades: doble, mitad inversa e incognita.
- 4 Restas pasando por la decena: directa, puente y sustraendo oculto.
- 5 Casi dobles: suma consecutiva y incognita.
- 6 Sumar y restar 9: compensacion.
- 7 Sumar y restar 11: descomposicion.
- 8 Amigos del 100: decenas exactas, numeros de dos cifras y tres sumandos.
- 9 Aproximacion a la decena.
- 10 Sumas con llevadas.
- 11 Restas con llevadas.
- 12 Multiplicacion por 10, 100 y 1000.
- 13 Numeros de cuatro cifras: descomposicion, redondeo, comparacion y series.
- 14 Sumas y restas con numeros de hasta cuatro cifras.
- 15 Rectas y angulos: rectas paralelas, perpendiculares y clasificacion de angulos.
- 16 Multiplicacion: suma repetida, tablas y factores.
- 101 Descomposicion U-D-C hasta 999, solo en recuperacion.
- 102 Series de 2, 5 y 10, solo en recuperacion.

## 7. Generador de Lengua

Namespace: `window.DragonApp.GeneratorLengua`.

Lengua ofrece tres formatos variado dentro de cada categoria:

- Escritura dirigida para las fichas que practican ortografia o produccion concreta.
- Seleccion rapida de la palabra o opcion correcta.
- Arrastre tactil o con raton de palabras y signos al recuadro de respuesta.

- 1 Ortografia C/QU.
- 2 Ortografia G/GU/GUE/GÜ.
- 3 Mayusculas y nombres propios.
- 4 Sinonimos y antonimos.
- 5 Clasificacion por silabas y acentuacion.
- 6 Sustantivos y pronombres.
- 7 Adjetivos y concordancia.
- 8 Verbos y tiempos verbales.
- 9 Tipos de oracion segun la modalidad.
- 10 Puntuacion basica.
- 11 Familias lexicas y palabras primitivas.
- 12 Coherencia, cohesion y conectores.

## 8. Misterio

Las historias se presentan por parrafos. Cada parrafo incluye una pregunta de desbloqueo, opciones y retroalimentacion con `paso1` y `paso2`. Las pistas deben localizar la frase o dato exacto del texto.

## 9. Temas visuales

- `.theme-math`: azul primario `#2563eb`, fondo `#eff6ff`.
- `.theme-lengua`: rojo primario `#dc2626`, fondo `#fef2f2`.
- `.theme-mystery`: purpura `#7c3aed`, dorado `#f59e0b`, fondo `#faf5ff`.

## 10. Respuestas y feedback

- Respuesta correcta: feedback positivo y avance automatico a los 700 ms.
- Respuesta incorrecta: detener el avance, mostrar los pasos y la respuesta correcta, y exigir continuar.
- Enter en el teclado fisico envia la respuesta escrita.
- Las sesiones se registran en progreso por categoria y en el historial local.

## 11. Panel de Profesor

Acceso protegido por PIN `5210`.

Permite:

- Editar el nombre del alumno.
- Cambiar entre Modo Recuperacion (2º) y Estandar (3º).
- Consultar ejercicios, aciertos y dominio.
- Exportar datos a CSV.
- Resetear todos los datos locales.

Las categorias 101 y 102 solo aparecen con el Modo Recuperacion activo.

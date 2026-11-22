# Academia del Dragon

Aplicacion web educativa SPA para practicar Matematicas, Lengua y Comprension Lectora.

## Ejecucion

Abrir `index.html` directamente en el navegador o servir la carpeta con un servidor web local.

No necesita instalar dependencias externas.

## Modelo de uso

Cada miniportatil contiene una copia de la carpeta. Al abrir la aplicacion por primera vez, el alumno escribe su nombre. No existe una lista de 22 alumnos ni seleccion entre varios perfiles.

Los datos se guardan localmente en `localStorage`, en la clave `dragon_data_local_v2`.

## Contenidos

- Matematicas: categorias 1-16, incluyendo las unidades del primer trimestre de 3º, y refuerzo 101-102.
- Lengua: ortografia, mayusculas, sinonimos y antonimos, silabas, sustantivos, pronombres, adjetivos, verbos, tipos de oracion, puntuacion, familias lexicas y cohesion.
- Misterio: historias guiadas por parrafos.

Las sesiones contienen 20 ejercicios exclusivos de la categoria elegida.

## Panel de Profesor

Usar el boton Profesor e introducir el PIN `5210`.

Desde el panel se puede editar el nombre, activar el refuerzo de 2º, consultar resultados, exportar CSV y resetear el progreso.

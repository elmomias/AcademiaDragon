# ESPECIFICACIÓN TÉCNICA Y FUNCIONAL: Academia del Dragón Matemático

## 1. Descripción del Proyecto
Plataforma web educativa (SPA en Vanilla HTML5, CSS3 y JavaScript ES6+ sin dependencias externas) para alumnado de 3º de Primaria (8-9 años) centrada exclusivamente en la práctica de cálculo mental.
- **Inspiración visual y UX:** Snappet / Khan Academy. Interfaz limpia, alto contraste, botones grandes táctiles, cero distracciones, NO es un videojuego (sin tiendas, monedas, cofres ni rankings competitivos).
- **Entorno de ejecución:** Navegador web e incrustada como pestaña web dentro de Microsoft Teams.
- **Regla de oro de UX:** Máximo 2 clics para empezar a practicar (`Inicio` -> `Continuar` -> `Ejercicios`).

## 2. Identificación sin fricción y Persistencia de Datos
- **Selector rápido de Alumno:** Si no hay alumno activo en `localStorage`, mostrar una pantalla limpia con una cuadrícula de botones con los alumnos de la clase (ID del 1 al 25, ej. "Alumno 1", "Alumno 2"... editable en configuración). Al pulsar uno, se guarda en `localStorage` (`dragon_active_student_id`) y en siguientes visitas entra directamente a la vista `Inicio`. Incluir en el Header el nombre del alumno activo y un botón discreto "Cambiar alumno".
- **Capa de almacenamiento (`js/services/storage.js`):** 
  - Guardar y sincronizar el estado completo por alumno en `localStorage` bajo la clave `dragon_data_v1`.
  - Preparar un método `syncToCloud(sessionPayload)` desacoplado (listo para conectar mediante `fetch` POST a un Webhook/API externa) que se dispare al completar una sesión de 20 ejercicios.
  - Incluir una vista oculta/modal para el Docente (`Panel Profesor`, accesible con PIN `1234`) que muestre una tabla comparativa con el progreso de todos los alumnos guardados y permita exportar/importar datos en JSON/CSV.

## 3. Arquitectura de Navegación (SPA)
Componentes principales: `Header`, `Sidebar` (o barra superior limpia), `DashboardInicio`, `PracticeSession`, `QuestionCard`, `FeedbackPanel`, `ProgressDashboard`, `AchievementsView`.
4 vistas principales para el alumno:
1. **Inicio**: Muestra Mundo actual, barra de Progreso del mundo (%), resultado de la Última sesión (ej. `18/20 correctas`) y un botón grande destacado `[ Continuar ]`.
2. **Entrenamiento**: Pantalla limpia de práctica (20 ejercicios por sesión). Incluye teclado numérico en pantalla (botones grandes para tablets/pizarra) además de soporte para teclado físico (`Enter` para comprobar/continuar).
3. **Progreso**: Barras de progreso horizontales con el porcentaje de dominio (0% a 100%) y etiqueta de escala (`0-59 Necesita ayuda`, `60-79 En desarrollo`, `80-94 Competente`, `95-100 Dominio`) de cada una de las 8 estrategias.
4. **Logros**: Cuadrícula de logros estrictamente pedagógicos desbloqueados (ej. `✓ Amigo del 10`, `✓ Constructor del 100`, `□ Maestro del +9`, `□ Explorador del 1000`).

## 4. Las 8 Estrategias Didácticas y Generador Matemático (`js/engine/generator.js`)
Generar ejercicios paramétricos dinámicos con su descomposición pedagógica exacta paso a paso (para el panel de ayuda/error):
1. **Amigos del 10** (Sumas y huecos que completan 10, ej. `7 + ? = 10` o `6 + 4`).
2. **Amigos del 100** (Complementarios al 100 con decenas completas y números de dos cifras, ej. `70 + 30`, `65 + 35`).
3. **Llegar a la decena** (Sumas pasando por la decena descomponiendo el segundo sumando, ej. `47 + 6` -> Ayuda: `47 + 3 = 50` y `50 + 3 = 53`).
4. **Restas inteligentes** (Restas pasando por la decena inferior descomponiendo el sustraendo, ej. `54 - 8` -> Ayuda: `54 - 4 = 50` y `50 - 4 = 46`).
5. **Dobles** (Dobles de números de 1 y 2 cifras, ej. `6 + 6`, `14 + 14`, `25 + 25`, `35 + 35`).
6. **Casi dobles** (Sumas de números consecutivos usando el doble como apoyo, ej. `7 + 8` -> Ayuda: `7 + 7 = 14` y `14 + 1 = 15`).
7. **+9 y -9** (Sumar o restar 9 sumando/restando 10 y ajustando 1, ej. `48 + 9` -> Ayuda: `48 + 10 = 58` y `58 - 1 = 57`).
8. **+11 y -11** (Sumar o restar 11 sumando/restando 10 y ajustando 1, ej. `36 + 11` -> Ayuda: `36 + 10 = 46` y `46 + 1 = 47`).

## 5. Flujo de Sesión, Feedback y Motor Adaptativo (`js/engine/adaptive.js`)
- **Duración de sesión:** 20 ejercicios exactos (5 de repaso de estrategias anteriores, 10 de la estrategia/mundo principal o selección adaptativa, 3 de transferencia, 2 sencillos de cierre).
- **Selección adaptativa:** Ponderación de ejercicios de refuerzo según debilidad: 40% estrategia más débil, 30% segunda más débil, 20% tercera más débil, 10% repaso general.
- **Comportamiento al responder:**
  - **Si es Correcto:** Mostrar feedback positivo breve (`✅ Correcto`) durante 700ms y avanzar automáticamente al siguiente ejercicio sin pedir clic adicional.
  - **Si es Incorrecto:** Detener avance automático y mostrar `FeedbackPanel` con `❌ Vamos a verlo` seguido de los dos pasos visuales de la estrategia correspondiente (ej. `54 - 4 = 50` / `50 - 4 = 46`) y el botón `[ Continuar ]`.
- **Ayuda preventiva automática:** Si el alumno comete 2 errores seguidos en la misma estrategia o 3 errores en los últimos 5 ejercicios, mostrar una pista visual de descomposición antes de que responda el siguiente ejercicio.
- **Desbloqueo de mundos:** Para avanzar del `mundoActual` al siguiente se requiere haber completado al menos 20 ejercicios de ese mundo y alcanzar `>= 80%` de dominio en esa estrategia.
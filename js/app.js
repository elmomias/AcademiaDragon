window.DragonApp = window.DragonApp || {};

document.addEventListener('DOMContentLoaded', () => {
    const Storage = window.DragonApp.Storage;
    const MathGenerator = window.DragonApp.GeneratorMath;
    const LanguageGenerator = window.DragonApp.GeneratorLengua;
    const MysteryGenerator = window.DragonApp.GeneratorMystery;
    const SESSION_LENGTH = 20;

    const categories = {
        math: [
            [200, 'Recuerda', 'Valor posicional y descomposición: unidades, decenas y centenas'],
            [1, 'Amigos del 10', 'Completar, descomponer y usar parejas del 10'],
            [2, 'Llegar a la decena', 'Puentes y sumas pasando por la decena'],
            [3, 'Dobles y mitades', 'Cálculo directo e incógnitas'],
            [4, 'Restas inteligentes', 'Restas pasando por la decena inferior'],
            [5, 'Casi dobles', 'Consecutivos usando el doble como apoyo'],
            [6, 'Sumar y restar 9', 'Compensación con +10 y -1'],
            [7, 'Sumar y restar 11', 'Descomposición con 10 y 1'],
            [8, 'Amigos del 100', 'Complementarios exactos y tres sumandos'],
            [9, 'Aproximar a la decena', 'Seleccionar la decena más cercana'],
            [10, 'Sumas con llevadas', 'Desglosar unidades y decenas'],
            [11, 'Restas con llevadas', 'Pedir una decena y restar'],
            [12, 'Multiplicar por 10, 100 y 1000', 'Añadir ceros con seguridad'],
            [13, 'Números de cuatro cifras', 'Leer, descomponer y ordenar hasta 9999'],
            [14, 'Sumas y restas', 'Operaciones de hasta cuatro cifras'],
            [15, 'Rectas y ángulos', 'Rectas, paralelas, perpendiculares y ángulos'],
            [16, 'La multiplicación', 'Tablas, suma repetida y factores']
        ],
        lengua: [
            [1, 'Ortografía C / QU', 'Escribe palabras completas correctamente'],
            [2, 'Ortografía G / GU / GÜ', 'Practica la diéresis y el sonido suave'],
            [3, 'Mayúsculas', 'Reescribe oraciones y nombres propios'],
            [4, 'Sinónimos y antónimos', 'Relaciona el significado de las palabras'],
            [5, 'Sílabas y acentuación', 'Clasifica palabras y tildes'],
            [6, 'Sustantivos y pronombres', 'Género, número y sustitución nominal'],
            [7, 'Adjetivos', 'Concuerdan con el sustantivo'],
            [8, 'Verbos', 'Acciones y tiempos verbales'],
            [9, 'Tipos de oración', 'Enunciativa, interrogativa y exclamativa'],
            [10, 'Puntuación', 'Punto, coma y signos de interrogación y exclamación'],
            [11, 'Familias de palabras', 'Palabras derivadas de una primitiva'],
            [12, 'Coherencia y cohesión', 'Ordena ideas y evita repeticiones'],
            [13, 'Ortografía MB / MP', 'Antes de b y p se escribe m'],
            [14, 'Ortografía Z / D final', 'Distingue la letra final y su plural']
        ]
    };

    const recoveryCategories = {
        math: [
            [301, 'La carrera del dragón', 'Conteo hasta 999 y ordinales hasta 20.º'],
            [302, 'La forja C, D y U', 'Composición, descomposición y redondeo hasta 999'],
            [303, 'Pociones mágicas y canjes', 'Sumas de hasta tres sumandos y restas con llevadas'],
            [304, 'El mapa de las cadencias', 'Series, suma-resta y grupos iguales']
        ],
        lengua: [
            [401, 'Pergamino de pistas', 'Comprensión de textos narrativos, descriptivos, dialogados y expositivos'],
            [402, 'El taller de las palabras', 'Vocabulario, concordancia y modalidad oracional'],
            [403, 'Crónica en cuatro pasos', 'Conectores temporales, puntuación y escritura revisada']
        ]
    };

    const elements = {
        app: document.getElementById('app'),
        nameInput: document.getElementById('student-name-input'),
        hubName: document.getElementById('hub-student-name'),
        mysteryUnlockStatus: document.getElementById('mystery-unlock-status'),
        nameLabel: document.getElementById('student-name-label'),
        editName: document.getElementById('btn-edit-name'),
        recoveryBadge: document.getElementById('hub-rec-badge'),
        categoryGrid: document.getElementById('category-grid'),
        categoryTitle: document.getElementById('category-title'),
        categorySubject: document.getElementById('category-subject-label'),
        prompt: document.getElementById('practice-prompt'),
        progress: document.getElementById('practice-progress'),
        practiceCategory: document.getElementById('practice-category'),
        options: document.getElementById('practice-options'),
        answerForm: document.getElementById('answer-form'),
        answerInput: document.getElementById('practice-input'),
        feedback: document.getElementById('practice-feedback'),
        numericKeypad: document.getElementById('numeric-keypad'),
        numericKeypadPanel: document.getElementById('numeric-keypad-panel'),
        numericKeypadToggle: document.getElementById('numeric-keypad-toggle'),
        practiceAnswerLayout: document.getElementById('practice-answer-layout')
    };

    const views = {
        name: document.getElementById('view-name-input'),
        hub: document.getElementById('view-hub'),
        categories: document.getElementById('view-category-select'),
        practice: document.getElementById('view-practice'),
        mystery: document.getElementById('view-mystery'),
        teacher: document.getElementById('view-teacher')
    };

    const state = {
        subject: null,
        categoryId: null,
        categoryName: '',
        exerciseIndex: 0,
        score: 0,
        exercise: null,
        answered: false,
        timer: null,
        mysteryStoryId: 1,
        numericKeypadMinimized: false,
        sessionLength: SESSION_LENGTH
    };

    function setTheme(theme) {
        elements.app.className = `theme-${theme}`;
    }

    function showView(name, theme = 'neutral') {
        clearTimeout(state.timer);
        Object.entries(views).forEach(([key, view]) => {
            view.hidden = key !== name;
        });
        if (name !== 'practice') {
            setNumericKeypadVisible(false);
        }
        setTheme(theme);
    }

    function renderIdentity() {
        const data = Storage.getData();
        const unlock = Storage.getStoryUnlockStatus(data);
        const hasName = Boolean(data.name);
        elements.hubName.textContent = data.name;
        elements.nameLabel.textContent = data.name;
        elements.nameLabel.hidden = !hasName;
        elements.editName.hidden = !hasName;
        elements.recoveryBadge.hidden = !data.modoRecuperacion;
        elements.mysteryUnlockStatus.textContent = unlock.canCreate
            ? `${unlock.unlockedStories} historia${unlock.unlockedStories === 1 ? '' : 's'} disponible${unlock.unlockedStories === 1 ? '' : 's'}. ${storyProgressMessage(unlock)}`
            : storyProgressMessage(unlock);
    }

    function start() {
        renderIdentity();
        showView(Storage.getData().name ? 'hub' : 'name');
    }

    function openSubject(subject) {
        if (subject === 'mystery') {
            openMystery();
            return;
        }
        state.subject = subject;
        state.categoryId = null;
        renderCategories();
        showView('categories', subject);
    }

    function renderCategories() {
        const subject = state.subject;
        const data = Storage.getData();
        const list = data.modoRecuperacion
            ? recoveryCategories[subject]
            : categories[subject];
        const subjectName = subject === 'math' ? 'Dragón Matemático' : 'Dragón de Lengua';
        elements.categoryTitle.textContent = subjectName;
        elements.categorySubject.textContent = subject === 'math' ? 'Matemáticas' : 'Lengua';
        elements.categoryGrid.replaceChildren();

        list.forEach(([id, title, description]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'category-btn';
            if (id === 200) {
                button.className += ' remember-category';
            }

            const level = getActivityLevel(id);
            if (level) {
                button.classList.add(`category-level-${level.level}`);
                button.setAttribute(
                    'aria-label',
                    `${title}. Realizada. ${level.source === 'mejor' ? 'Mejor' : 'Nivel'}: ${level.percentage} por ciento`
                );

                const resultBadge = document.createElement('span');
                resultBadge.className = 'activity-result-badge';
                resultBadge.innerHTML = `<span aria-hidden="true">✓</span><span>${level.source === 'mejor' ? 'Mejor' : 'Nivel'} ${level.percentage}%</span>`;
                button.appendChild(resultBadge);
            }

            const strong = document.createElement('strong');
            strong.textContent = title;
            const small = document.createElement('small');
            small.textContent = description;
            button.append(strong, small);
            button.addEventListener('click', () => startSession(id, title));
            elements.categoryGrid.appendChild(button);
        });
    }

    function startSession(categoryId, categoryName) {
        state.categoryId = categoryId;
        state.categoryName = categoryName;
        state.exerciseIndex = 0;
        state.score = 0;
        state.sessionLength = categoryId === 200 ? 10 : SESSION_LENGTH;
        state.exercise = null;
        state.completionRecorded = false;
        showView('practice', state.subject);
        nextExercise();
    }

    function nextExercise() {
        clearTimeout(state.timer);
        if (state.exerciseIndex >= state.sessionLength) {
            finishSession();
            return;
        }
        state.exerciseIndex += 1;
        state.answered = false;
        state.exercise = state.subject === 'math'
            ? MathGenerator.generateByStrategy(state.categoryId, {
                questionNumber: state.exerciseIndex,
                recovery2: Storage.getData().modoRecuperacion
            })
            : LanguageGenerator.generateByStrategy(state.categoryId, {
                questionNumber: state.exerciseIndex,
                recovery2: Storage.getData().modoRecuperacion
            });
        renderExercise();
    }

    function normalizeAnswer(value) {
        return String(value)
            .trim()
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/,/g, '.')
            .replace(/[¿?¡!;:]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getActivityLevel(categoryId) {
        const data = Storage.getData();
        const subject = state.subject;
        const progressMap = subject === 'lengua' ? data.progresoLengua : data.progresoMath;
        const record = progressMap[String(categoryId)];
        const completed = (data.actividadesCompletadas || [])
            .filter(activity =>
                activity.subject === (subject === 'lengua' ? 'lengua' : 'math')
                && Number(activity.strategyId) === Number(categoryId)
            );

        if (!record && !completed.length) {
            return null;
        }

        if (!completed.length && record && (Number(record.intentos) || 0) <= 0) {
            return null;
        }

        let percentage = 0;
        let source = 'actividad';

        if (completed.length) {
            percentage = completed.reduce((best, activity) => {
                const total = Math.max(1, Number(activity.total) || 1);
                const score = Math.max(0, Math.min(total, Number(activity.score) || 0));
                return Math.max(best, Math.round((score / total) * 100));
            }, 0);
            source = 'mejor';
        } else if (record) {
            const attempts = Math.max(0, Number(record.intentos) || 0);
            const correct = Math.max(0, Number(record.aciertos) || 0);
            percentage = attempts > 0
                ? Math.round((correct / attempts) * 100)
                : Math.max(0, Math.min(100, Number(record.dominio) || 0));
            source = 'progreso';
        }

        const safePercentage = Math.max(0, Math.min(100, Number(percentage) || 0));
        if (safePercentage >= 75) return { level: 'achieved', percentage: safePercentage, source };
        if (safePercentage >= 50) return { level: 'intermediate', percentage: safePercentage, source };
        return { level: 'reinforce', percentage: safePercentage, source };
    }

    function isNumericOpenAnswer(exercise) {
        if (state.subject !== 'math' || !exercise) return false;
        if (Array.isArray(exercise.options) && exercise.options.length > 0) return false;
        return /^[-+]?(?:\d+(?:[,.]\d*)?|[,.]\d+)$/.test(String(exercise.answer).trim());
    }

    function setNumericKeypadVisible(visible) {
        elements.numericKeypad.hidden = !visible;
        elements.practiceAnswerLayout.classList.toggle('numeric-keypad-active', visible);
        if (!visible) return;
        elements.numericKeypad.classList.toggle('minimized', state.numericKeypadMinimized);
        elements.numericKeypadToggle.textContent = state.numericKeypadMinimized ? 'Mostrar' : 'Minimizar';
        elements.numericKeypadToggle.setAttribute('aria-expanded', String(!state.numericKeypadMinimized));
    }

    function insertNumericText(text) {
        if (elements.answerInput.disabled) return;
        const input = elements.answerInput;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        input.value = `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
        const cursor = start + text.length;
        input.setSelectionRange(cursor, cursor);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
    }

    function handleNumericKeypadAction(action) {
        if (elements.answerInput.disabled) return;
        if (action === 'clear') {
            elements.answerInput.value = '';
            elements.answerInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (action === 'backspace') {
            const input = elements.answerInput;
            const start = input.selectionStart ?? input.value.length;
            const end = input.selectionEnd ?? input.value.length;
            if (start !== end) {
                input.value = `${input.value.slice(0, start)}${input.value.slice(end)}`;
                input.setSelectionRange(start, start);
            } else if (start > 0) {
                input.value = `${input.value.slice(0, start - 1)}${input.value.slice(end)}`;
                input.setSelectionRange(start - 1, start - 1);
            }
            input.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (action === 'toggle-sign') {
            const input = elements.answerInput;
            input.value = input.value.startsWith('-')
                ? input.value.slice(1)
                : `-${input.value}`;
            input.setSelectionRange(input.value.length, input.value.length);
            input.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (action === 'confirm') {
            elements.answerForm.requestSubmit();
        }
        elements.answerInput.focus();
    }

    function lockAnswers(locked) {
        elements.answerInput.disabled = locked;
        elements.answerForm.querySelector('button').disabled = locked;
        elements.options.querySelectorAll('button').forEach(button => {
            button.disabled = locked;
        });
        elements.numericKeypadPanel.querySelectorAll('button').forEach(button => {
            button.disabled = locked;
        });
    }

    function renderExercise() {
        const exercise = state.exercise;
        elements.progress.textContent = `Ejercicio ${state.exerciseIndex} de ${state.sessionLength}`;
        elements.practiceCategory.textContent = state.categoryName;
        elements.prompt.textContent = exercise.prompt;
        elements.feedback.hidden = true;
        elements.feedback.className = 'feedback-box';
        elements.options.replaceChildren();
        elements.answerInput.value = '';

        const hasOptions = Array.isArray(exercise.options) && exercise.options.length > 0;
        elements.options.hidden = !hasOptions;
        elements.answerForm.hidden = hasOptions;
        setNumericKeypadVisible(isNumericOpenAnswer(exercise));
        if (exercise.activityType === 'drag') {
            elements.options.className = 'drag-workspace';

            const dropZone = document.createElement('button');
            dropZone.type = 'button';
            dropZone.className = 'drag-drop-zone';
            dropZone.textContent = 'Arrastra aquí la respuesta';
            dropZone.addEventListener('dragover', event => {
                event.preventDefault();
                dropZone.classList.add('drag-over');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
            dropZone.addEventListener('drop', event => {
                event.preventDefault();
                dropZone.classList.remove('drag-over');
                const value = event.dataTransfer.getData('text/plain');
                if (value) {
                    dropZone.textContent = value;
                    checkAnswer(value);
                }
            });
            elements.options.appendChild(dropZone);

            const wordBank = document.createElement('div');
            wordBank.className = 'drag-word-bank';
            exercise.options.forEach(value => {
                const word = document.createElement('button');
                word.type = 'button';
                word.className = 'drag-word';
                word.textContent = String(value);
                word.draggable = true;
                word.addEventListener('dragstart', event => {
                    event.dataTransfer.setData('text/plain', String(value));
                });
                word.addEventListener('click', () => {
                    dropZone.textContent = String(value);
                    checkAnswer(value);
                });
                wordBank.appendChild(word);
            });
            elements.options.appendChild(wordBank);
        } else if (hasOptions) {
            elements.options.className = 'options-grid';
            exercise.options.forEach(value => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'option-btn';
                button.textContent = String(value);
                button.addEventListener('click', () => checkAnswer(value));
                elements.options.appendChild(button);
            });
        } else {
            elements.options.className = 'options-grid';
        }
        lockAnswers(false);
        if (!hasOptions) {
            focusAnswerInput();
        }
    }

    function focusAnswerInput() {
        requestAnimationFrame(() => {
            if (!elements.answerForm.hidden && !elements.answerInput.disabled) {
                elements.answerInput.focus();
                elements.answerInput.select();
            }
        });
    }

    function checkAnswer(answer) {
        if (state.answered) return;
        const cleanAnswer = String(answer).trim();
        if (!cleanAnswer) {
            elements.answerInput.focus();
            return;
        }

        state.answered = true;
        const correct = state.subject === 'lengua'
            ? cleanAnswer.localeCompare(String(state.exercise.answer).trim(), 'es', {
                sensitivity: 'accent',
                usage: 'search'
            }) === 0
            : normalizeAnswer(cleanAnswer) === normalizeAnswer(state.exercise.answer);
        if (correct) state.score += 1;
        Storage.updateProgress(state.subject, state.categoryId, correct);
        lockAnswers(true);
        showFeedback(correct);
    }

    function showFeedback(correct) {
        elements.feedback.hidden = false;
        elements.feedback.classList.add(correct ? 'success' : 'error');
        if (correct) {
            elements.feedback.innerHTML = `
                <h2>✅ ¡Correcto!</h2>
                <p>${escapeHtml(state.exercise.paso2 || '¡Excelente trabajo!')}</p>
            `;
            state.timer = setTimeout(nextExercise, 700);
            return;
        }

        elements.feedback.innerHTML = `
            <h2>💡 Vamos a verlo</h2>
            <p><strong>Paso 1:</strong> ${escapeHtml(state.exercise.paso1)}</p>
            <p><strong>Paso 2:</strong> ${escapeHtml(state.exercise.paso2)}</p>
            <p><strong>Respuesta:</strong> ${escapeHtml(String(state.exercise.answer))}</p>
            <button id="btn-continue-exercise" class="action-btn primary" type="button">Continuar</button>
        `;
        document.getElementById('btn-continue-exercise').addEventListener('click', nextExercise);
    }

    function finishSession() {
        if (!state.completionRecorded) {
            Storage.completeActivity(state.subject, state.categoryId, state.score, state.sessionLength);
            state.completionRecorded = true;
        }
        const unlock = Storage.getStoryUnlockStatus();
        state.answered = true;
        elements.progress.textContent = 'Sesión completada';
        elements.practiceCategory.textContent = state.categoryName;
        elements.prompt.textContent = '🏆 ¡Sesión completada!';
        elements.options.hidden = true;
        elements.answerForm.hidden = true;
        setNumericKeypadVisible(false);
        elements.feedback.hidden = false;
        elements.feedback.className = 'feedback-box success';
        elements.feedback.innerHTML = `
            <h2>¡Buen trabajo, ${escapeHtml(Storage.getData().name)}!</h2>
            <p>Has acertado <strong>${state.score} de ${state.sessionLength}</strong> ejercicios.</p>
            <p>${escapeHtml(activityUnlockMessage(unlock, state.score))}</p>
            <button id="btn-finish-session" class="action-btn primary" type="button">Elegir otra categoría</button>
        `;
        document.getElementById('btn-finish-session').addEventListener('click', () => {
            renderCategories();
            showView('categories', state.subject);
        });
    }

    function storyProgressMessage(status) {
        const parts = [];
        if (status.missingMath) {
            parts.push(`${status.missingMath} actividad${status.missingMath === 1 ? '' : 'es'} de Matemáticas`);
        }
        if (status.missingLanguage) {
            parts.push(`${status.missingLanguage} actividad${status.missingLanguage === 1 ? '' : 'es'} de Lengua`);
        }
        if (!parts.length) {
            return '¡Ya puedes crear una nueva historia de misterio!';
        }
        return `¡Casi lo tienes! Aún te faltan ${parts.join(' y ')}.`;
    }

    function activityUnlockMessage(status, score) {
        if (score < Math.ceil(state.sessionLength * 0.8)) {
            return `${storyProgressMessage(status)} Supera una actividad al 80 % para avanzar hacia tu próxima historia.`;
        }
        return status.nextStoryReady || status.canCreate
            ? `¡Actividad superada! Ya puedes crear una historia de misterio. ${storyProgressMessage(status)}`
            : `¡Actividad superada! ${storyProgressMessage(status)}`;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderStorySelector() {
        const selector = document.getElementById('mystery-story-selector');
        const unlock = Storage.getStoryUnlockStatus();
        selector.replaceChildren();
        MysteryGenerator.getMysteryStoriesList().slice(0, unlock.unlockedStories).forEach(story => {
            const option = document.createElement('option');
            option.value = String(story.id);
            option.textContent = story.title;
            option.selected = story.id === state.mysteryStoryId;
            selector.appendChild(option);
        });
    }

    function openMystery() {
        const data = Storage.getData();
        const unlock = Storage.getStoryUnlockStatus(data);
        if (!unlock.canCreate) {
            alert(storyProgressMessage(unlock));
            showView('hub');
            return;
        }
        const unlockedIds = Array.from({ length: unlock.unlockedStories }, (_, index) => index + 1);
        state.mysteryStoryId = unlockedIds.find(id => Number(data.misterioProgreso[id]) < 20) || unlockedIds[0];
        renderStorySelector();
        renderMystery();
        showView('mystery', 'mystery');
    }

    function renderMystery() {
        const data = Storage.getData();
        const progress = Number(data.misterioProgreso[state.mysteryStoryId]) || 0;
        const story = MysteryGenerator.getMysteryStoriesList().find(item => item.id === state.mysteryStoryId);
        const question = MysteryGenerator.generateByStrategy(state.mysteryStoryId, {
            questionNumber: Math.min(20, progress + 1),
            recovery2: data.modoRecuperacion,
            masteredStrategies: Storage.getMasteredStrategies(data)
        });
        document.getElementById('mystery-title').textContent = story.title;
        document.getElementById('mystery-step').textContent = `Pantalla ${Math.min(20, progress + 1)} de 20`;
        document.getElementById('mystery-text').textContent = question.text;
        document.getElementById('mystery-prompt').textContent = question.prompt;
        const feedback = document.getElementById('mystery-feedback');
        feedback.hidden = true;
        const container = document.getElementById('mystery-options');
        container.replaceChildren();
        if (progress >= 20) {
            feedback.hidden = false;
            feedback.className = 'feedback-box success';
            feedback.innerHTML = `
                <h2>🏆 ¡Misterio resuelto!</h2>
                <p>Has completado las 20 pantallas de esta aventura.</p>
                <button id="btn-mystery-finished" class="action-btn primary" type="button">Volver al menú</button>
            `;
            document.getElementById('btn-mystery-finished').addEventListener('click', () => showView('hub'));
            return;
        }
        question.options.forEach(optionValue => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'option-btn';
            button.textContent = optionValue;
            button.addEventListener('click', () => answerMystery(optionValue, question, progress));
            container.appendChild(button);
        });
    }

    function answerMystery(answer, question, currentIndex) {
        const correct = normalizeAnswer(answer) === normalizeAnswer(question.answer);
        const feedback = document.getElementById('mystery-feedback');
        feedback.hidden = false;
        feedback.className = `feedback-box ${correct ? 'success' : 'error'}`;
        if (!correct) {
            feedback.innerHTML = `
                <h2>🔎 Atiende al detalle</h2>
                <p>${escapeHtml(question.paso1)}</p>
                <button id="btn-retry-mystery" class="action-btn primary" type="button">Releer y repetir</button>
            `;
            document.getElementById('btn-retry-mystery').addEventListener('click', renderMystery);
            return;
        }

        const nextIndex = currentIndex + 1;
        Storage.updateMysteryProgress(state.mysteryStoryId, nextIndex);
        const completed = nextIndex >= 20;
        feedback.innerHTML = completed
            ? `<h2>🏆 ¡Misterio resuelto!</h2><p>${escapeHtml(question.paso2)}</p><button id="btn-mystery-continue" class="action-btn primary" type="button">Volver al menú</button>`
            : `<h2>✨ ¡Pista encontrada!</h2><p>${escapeHtml(question.paso2)}</p><button id="btn-mystery-continue" class="action-btn primary" type="button">Siguiente pantalla</button>`;
        document.getElementById('btn-mystery-continue').addEventListener('click', () => completed ? showView('hub') : renderMystery());
    }

    function showNamePrompt() {
        const data = Storage.getData();
        const value = prompt('Escribe el nombre del alumno (máximo 20 caracteres):', data.name);
        if (value && value.trim()) {
            Storage.setStudentName(value);
            renderIdentity();
        }
    }

    function openTeacherPanel() {
        const pin = prompt('Introduce el PIN de Profesor:');
        if (pin !== Storage.PIN_SECRET) {
            if (pin !== null) alert('PIN incorrecto.');
            return;
        }
        renderTeacherPanel();
        showView('teacher', 'neutral');
    }

    function totalProgress(progress) {
        return Object.values(progress).reduce((total, record) => {
            total.attempts += Number(record.intentos) || 0;
            total.correct += Number(record.aciertos) || 0;
            return total;
        }, { attempts: 0, correct: 0 });
    }

    function categoryName(subject, categoryId) {
        const list = subject === 'math'
            ? [...categories.math, ...recoveryCategories.math]
            : [...categories.lengua, ...recoveryCategories.lengua];
        const category = list.find(([id]) => Number(id) === Number(categoryId));
        return category ? category[1] : `Categoría ${categoryId}`;
    }

    function performanceLevel(percentage) {
        if (percentage >= 75) return 'achieved';
        if (percentage >= 50) return 'intermediate';
        return 'reinforce';
    }

    function teacherActivityData(data, subject) {
        const progress = subject === 'lengua' ? data.progresoLengua : data.progresoMath;
        const completed = (data.actividadesCompletadas || []).filter(activity => activity.subject === subject);
        const ids = new Set([
            ...Object.keys(progress || {}).filter(id =>
                Number.isFinite(Number(id))
                && (Number(progress[id].intentos) || 0) > 0
            ),
            ...completed
                .filter(activity => Number.isFinite(Number(activity.strategyId)))
                .map(activity => String(Number(activity.strategyId)))
        ]);

        return [...ids].map(id => {
            const record = (progress && progress[id]) || {};
            const sessions = completed.filter(activity => Number(activity.strategyId) === Number(id));
            let attempts = Math.max(0, Number(record.intentos) || 0);
            let correct = Math.max(0, Number(record.aciertos) || 0);
            if (!attempts && sessions.length) {
                attempts = sessions.reduce((sum, activity) => sum + Math.max(0, Number(activity.total) || 0), 0);
                correct = sessions.reduce((sum, activity) => sum + Math.max(0, Number(activity.score) || 0), 0);
            }
            const failures = Math.max(0, attempts - correct);
            const accumulated = attempts ? Math.round((correct / attempts) * 100) : 0;
            const best = sessions.reduce((maximum, activity) => {
                const total = Math.max(1, Number(activity.total) || 1);
                const score = Math.max(0, Math.min(total, Number(activity.score) || 0));
                return Math.max(maximum, Math.round((score / total) * 100));
            }, -1);
            return {
                id,
                subject,
                name: categoryName(subject, id),
                attempts,
                correct,
                failures,
                accumulated,
                percentage: best >= 0 ? best : accumulated,
                source: best >= 0 ? 'Mejor resultado' : 'Progreso acumulado'
            };
        });
    }

    function renderTeacherActivityProgress(data) {
        const rows = [
            ...teacherActivityData(data, 'math'),
            ...teacherActivityData(data, 'lengua')
        ];
        const progressContainer = document.getElementById('teacher-activity-progress');
        const summaryContainer = document.getElementById('teacher-failure-summary');

        if (!rows.length) {
            progressContainer.innerHTML = '<p class="teacher-empty">Todavía no hay actividades realizadas.</p>';
            summaryContainer.innerHTML = '<p class="teacher-empty">Al registrar respuestas aparecerán sugerencias de refuerzo.</p>';
            return;
        }

        progressContainer.innerHTML = `
            <div class="activity-progress-list">
                ${rows.map(row => `
                    <article class="activity-progress-row level-${performanceLevel(row.percentage)}">
                        <div class="activity-progress-copy">
                            <strong>${escapeHtml(row.name)}</strong>
                            <span>${row.subject === 'math' ? 'Matemáticas' : 'Lengua'} · ${escapeHtml(row.source)}</span>
                        </div>
                        <div class="activity-progress-metrics">
                            <span class="activity-percent">${row.percentage}%</span>
                            <span>${row.correct}/${row.attempts} aciertos</span>
                            <span>${row.failures} ${row.failures === 1 ? 'error' : 'errores'}</span>
                            <button class="activity-reset-btn" type="button" data-subject="${row.subject}" data-category-id="${row.id}">
                                Restablecer
                            </button>
                        </div>
                    </article>
                `).join('')}
            </div>
        `;

        const priorities = rows
            .filter(row => row.failures > 0)
            .sort((a, b) => a.accumulated - b.accumulated || b.failures - a.failures)
            .slice(0, 3);
        if (!priorities.length) {
            summaryContainer.innerHTML = '<p class="teacher-positive">De momento no hay fallos registrados. Conviene mantener una práctica variada.</p>';
            return;
        }
        summaryContainer.innerHTML = `
            <ol class="failure-summary-list">
                ${priorities.map(row => `
                    <li>
                        <strong>${escapeHtml(row.name)}</strong>
                        <span>${row.failures} ${row.failures === 1 ? 'respuesta para revisar' : 'respuestas para revisar'} · ${row.accumulated}% acumulado.</span>
                        <small>Volver a practicar esta estrategia ayudará a consolidar el contenido.</small>
                    </li>
                `).join('')}
            </ol>
        `;
    }

    function renderTeacherPanel() {
        const data = Storage.getData();
        document.getElementById('teacher-student-name').value = data.name;
        document.getElementById('teacher-toggle-rec').checked = data.modoRecuperacion;
        document.getElementById('teacher-rec-status').textContent = data.modoRecuperacion ? 'Refuerzo 2º activo' : 'Estándar 3º';
        const math = totalProgress(data.progresoMath);
        const language = totalProgress(data.progresoLengua);
        const attempts = math.attempts + language.attempts;
        const correct = math.correct + language.correct;
        const percentage = attempts ? Math.round(correct / attempts * 100) : 0;
        document.getElementById('teacher-stats-text').innerHTML = `
            <div class="stats-line">
                <span class="stat-pill">Ejercicios: ${attempts}</span>
                <span class="stat-pill">Aciertos: ${correct}</span>
                <span class="stat-pill">Dominio: ${percentage}%</span>
                <span class="stat-pill">Matemáticas: ${math.attempts}</span>
                <span class="stat-pill">Lengua: ${language.attempts}</span>
            </div>
        `;
        renderTeacherActivityProgress(data);
    }

    document.getElementById('name-form').addEventListener('submit', event => {
        event.preventDefault();
        const name = elements.nameInput.value.trim();
        if (!name) return;
        Storage.setStudentName(name);
        renderIdentity();
        showView('hub');
    });
    document.querySelectorAll('[data-subject]').forEach(button => {
        button.addEventListener('click', () => openSubject(button.dataset.subject));
    });
    document.getElementById('btn-home').addEventListener('click', () => {
        renderIdentity();
        showView(Storage.getData().name ? 'hub' : 'name');
    });
    elements.editName.addEventListener('click', showNamePrompt);
    document.getElementById('btn-category-back').addEventListener('click', () => showView('hub'));
    document.getElementById('btn-practice-back').addEventListener('click', () => {
        renderCategories();
        showView('categories', state.subject);
    });
    elements.answerForm.addEventListener('submit', event => {
        event.preventDefault();
        checkAnswer(elements.answerInput.value);
    });
    elements.numericKeypadToggle.addEventListener('click', () => {
        state.numericKeypadMinimized = !state.numericKeypadMinimized;
        setNumericKeypadVisible(!elements.numericKeypad.hidden);
    });
    elements.numericKeypadPanel.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.dataset.number !== undefined) {
            insertNumericText(button.dataset.number);
        } else if (button.dataset.action) {
            handleNumericKeypadAction(button.dataset.action);
        }
    });
    document.getElementById('btn-mystery-back').addEventListener('click', () => showView('hub'));
    document.getElementById('mystery-story-selector').addEventListener('change', event => {
        state.mysteryStoryId = Number(event.target.value);
        renderMystery();
    });
    document.getElementById('btn-teacher-panel').addEventListener('click', openTeacherPanel);
    document.getElementById('teacher-activity-progress').addEventListener('click', event => {
        const button = event.target.closest('[data-category-id]');
        if (!button) return;
        const subject = button.dataset.subject;
        const categoryId = Number(button.dataset.categoryId);
        const label = categoryName(subject, categoryId);
        if (!confirm(`¿Restablecer «${label}»?\n\nSe eliminarán únicamente sus intentos y sesiones; el perfil y las demás actividades no cambiarán.`)) {
            return;
        }
        Storage.resetActivity(subject, categoryId);
        renderTeacherPanel();
        renderIdentity();
    });
    document.getElementById('btn-close-teacher').addEventListener('click', () => showView(Storage.getData().name ? 'hub' : 'name'));
    document.getElementById('btn-export-csv').addEventListener('click', () => Storage.exportCSV());
    document.getElementById('btn-save-name').addEventListener('click', () => {
        const name = document.getElementById('teacher-student-name').value.trim();
        if (!name) return;
        Storage.setStudentName(name);
        renderIdentity();
        alert('Nombre guardado.');
    });
    document.getElementById('teacher-toggle-rec').addEventListener('change', event => {
        Storage.setRecuperacion(event.target.checked);
        renderTeacherPanel();
        renderIdentity();
    });
    document.getElementById('btn-reset-data').addEventListener('click', () => {
        if (!confirm('¿Seguro que quieres borrar el nombre y todo el progreso de este portátil?')) return;
        Storage.resetData();
        renderIdentity();
        elements.nameInput.value = '';
        showView('name');
    });

    start();
});

window.DragonApp = window.DragonApp || {};

document.addEventListener('DOMContentLoaded', () => {
    const Storage = window.DragonApp.Storage;
    const MathGenerator = window.DragonApp.GeneratorMath;
    const LanguageGenerator = window.DragonApp.GeneratorLengua;
    const SESSION_LENGTH = 20;

    const categories = {
        math: [
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
            [12, 'Coherencia y cohesión', 'Ordena ideas y evita repeticiones']
        ]
    };

    const recoveryCategories = [
        [101, 'Centenas, decenas y unidades', 'Descomponer números hasta 999'],
        [102, 'Series numéricas', 'Contar de 2 en 2, 5 en 5 y 10 en 10']
    ];

    const elements = {
        app: document.getElementById('app'),
        nameInput: document.getElementById('student-name-input'),
        hubName: document.getElementById('hub-student-name'),
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
        feedback: document.getElementById('practice-feedback')
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
        mysteryStoryId: 1
    };

    function setTheme(theme) {
        elements.app.className = `theme-${theme}`;
    }

    function showView(name, theme = 'neutral') {
        clearTimeout(state.timer);
        Object.entries(views).forEach(([key, view]) => {
            view.hidden = key !== name;
        });
        setTheme(theme);
    }

    function renderIdentity() {
        const data = Storage.getData();
        const hasName = Boolean(data.name);
        elements.hubName.textContent = data.name;
        elements.nameLabel.textContent = data.name;
        elements.nameLabel.hidden = !hasName;
        elements.editName.hidden = !hasName;
        elements.recoveryBadge.hidden = !data.modoRecuperacion;
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
        const list = subject === 'math' && data.modoRecuperacion
            ? [...categories.math, ...recoveryCategories]
            : categories[subject];
        const subjectName = subject === 'math' ? 'Dragón Matemático' : 'Dragón de Lengua';
        elements.categoryTitle.textContent = subjectName;
        elements.categorySubject.textContent = subject === 'math' ? 'Matemáticas' : 'Lengua';
        elements.categoryGrid.replaceChildren();

        list.forEach(([id, title, description]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'category-btn';
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
        state.exercise = null;
        showView('practice', state.subject);
        nextExercise();
    }

    function nextExercise() {
        clearTimeout(state.timer);
        if (state.exerciseIndex >= SESSION_LENGTH) {
            finishSession();
            return;
        }
        state.exerciseIndex += 1;
        state.answered = false;
        state.exercise = state.subject === 'math'
            ? MathGenerator.generateByStrategy(state.categoryId)
            : LanguageGenerator.generateByStrategy(state.categoryId);
        renderExercise();
    }

    function normalizeAnswer(value) {
        return String(value)
            .trim()
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[¿?¡!.,;:]+/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function lockAnswers(locked) {
        elements.answerInput.disabled = locked;
        elements.answerForm.querySelector('button').disabled = locked;
        elements.options.querySelectorAll('button').forEach(button => {
            button.disabled = locked;
        });
    }

    function renderExercise() {
        const exercise = state.exercise;
        elements.progress.textContent = `Ejercicio ${state.exerciseIndex} de ${SESSION_LENGTH}`;
        elements.practiceCategory.textContent = state.categoryName;
        elements.prompt.textContent = exercise.prompt;
        elements.feedback.hidden = true;
        elements.feedback.className = 'feedback-box';
        elements.options.replaceChildren();
        elements.answerInput.value = '';

        const hasOptions = Array.isArray(exercise.options) && exercise.options.length > 0;
        elements.options.hidden = !hasOptions;
        elements.answerForm.hidden = hasOptions;
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
            elements.answerInput.focus();
        }
        lockAnswers(false);
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
        state.answered = true;
        elements.progress.textContent = 'Sesión completada';
        elements.practiceCategory.textContent = state.categoryName;
        elements.prompt.textContent = '🏆 ¡Sesión completada!';
        elements.options.hidden = true;
        elements.answerForm.hidden = true;
        elements.feedback.hidden = false;
        elements.feedback.className = 'feedback-box success';
        elements.feedback.innerHTML = `
            <h2>¡Buen trabajo, ${escapeHtml(Storage.getData().name)}!</h2>
            <p>Has acertado <strong>${state.score} de ${SESSION_LENGTH}</strong> ejercicios.</p>
            <button id="btn-finish-session" class="action-btn primary" type="button">Elegir otra categoría</button>
        `;
        document.getElementById('btn-finish-session').addEventListener('click', () => {
            renderCategories();
            showView('categories', state.subject);
        });
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
        selector.replaceChildren();
        LanguageGenerator.getMysteryStoriesList().forEach(story => {
            const option = document.createElement('option');
            option.value = String(story.id);
            option.textContent = story.title;
            option.selected = story.id === state.mysteryStoryId;
            selector.appendChild(option);
        });
    }

    function openMystery() {
        renderStorySelector();
        renderMystery();
        showView('mystery', 'mystery');
    }

    function renderMystery() {
        const progress = Storage.getData().misterioProgreso[state.mysteryStoryId] || 0;
        const paragraph = LanguageGenerator.getMysteryParagraph(state.mysteryStoryId, progress);
        document.getElementById('mystery-title').textContent = paragraph.storyTitle;
        document.getElementById('mystery-step').textContent = `Párrafo ${paragraph.paragraphNumber} de ${paragraph.totalParagraphs}`;
        document.getElementById('mystery-text').textContent = paragraph.text;
        document.getElementById('mystery-prompt').textContent = paragraph.prompt;
        const feedback = document.getElementById('mystery-feedback');
        feedback.hidden = true;
        const container = document.getElementById('mystery-options');
        container.replaceChildren();
        paragraph.options.forEach(optionValue => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'option-btn';
            button.textContent = optionValue;
            button.addEventListener('click', () => answerMystery(optionValue, paragraph, progress));
            container.appendChild(button);
        });
    }

    function answerMystery(answer, paragraph, currentIndex) {
        const correct = normalizeAnswer(answer) === normalizeAnswer(paragraph.answer);
        const feedback = document.getElementById('mystery-feedback');
        feedback.hidden = false;
        feedback.className = `feedback-box ${correct ? 'success' : 'error'}`;
        if (!correct) {
            feedback.innerHTML = `
                <h2>🔎 Atiende al detalle</h2>
                <p>${escapeHtml(paragraph.paso1)}</p>
                <button id="btn-retry-mystery" class="action-btn primary" type="button">Releer y repetir</button>
            `;
            document.getElementById('btn-retry-mystery').addEventListener('click', renderMystery);
            return;
        }

        const nextIndex = currentIndex + 1;
        Storage.updateMysteryProgress(state.mysteryStoryId, nextIndex);
        const completed = nextIndex >= paragraph.totalParagraphs;
        feedback.innerHTML = completed
            ? `<h2>🏆 ¡Misterio resuelto!</h2><p>${escapeHtml(paragraph.paso2)}</p><button id="btn-mystery-continue" class="action-btn primary" type="button">Volver al menú</button>`
            : `<h2>✨ ¡Pista encontrada!</h2><p>${escapeHtml(paragraph.paso2)}</p><button id="btn-mystery-continue" class="action-btn primary" type="button">Siguiente párrafo</button>`;
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
    document.getElementById('btn-mystery-back').addEventListener('click', () => showView('hub'));
    document.getElementById('mystery-story-selector').addEventListener('change', event => {
        state.mysteryStoryId = Number(event.target.value);
        renderMystery();
    });
    document.getElementById('btn-teacher-panel').addEventListener('click', openTeacherPanel);
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

window.DragonApp = window.DragonApp || {};

document.addEventListener('DOMContentLoaded', () => {
    const Storage = window.DragonApp.Storage;
    const Adaptive = window.DragonApp.Adaptive;

    const container = document.getElementById('app-container');
    const studentBadge = document.getElementById('active-student-badge');
    const navButtons = document.querySelectorAll('.nav-btn');

    let currentView = 'inicio';
    let sessionState = null;

    function updateHeader() {
        const student = Storage.getActiveStudent();
        studentBadge.textContent = student ? `👤 ${student.nombre}` : 'Selecciona alumno';
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === currentView);
        });
    }

    function navigate(view) {
        const student = Storage.getActiveStudent();
        if (!student && view !== 'selector' && view !== 'profesor') {
            renderStudentSelector();
            return;
        }
        currentView = view;
        updateHeader();

        if (view === 'inicio') renderDashboard();
        else if (view === 'entrenamiento') startOrResumeSession();
        else if (view === 'progreso') renderProgress();
        else if (view === 'logros') renderAchievements();
        else if (view === 'profesor') renderTeacherPanel();
    }

    function renderStudentSelector() {
        currentView = 'selector';
        updateHeader();
        const db = Storage.getDatabase();
        const students = Object.values(db.students);

        container.innerHTML = `
            <div class="card">
                <h2>👋 ¡Bienvenido a 3ºB Hermandad del Dragón!</h2>
                <p class="subtitle" style="margin-top:6px;">Toca tu nombre para entrar directamente a tu entrenamiento:</p>
                <div class="student-grid">
                    ${students.map(st => `
                        <button class="student-card-btn" data-id="${st.id}">
                            ${st.nombre}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        container.querySelectorAll('.student-card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                Storage.setActiveStudentId(btn.dataset.id);
                navigate('inicio');
            });
        });
    }

    function renderDashboard() {
        const student = Storage.getActiveStudent();
        const worldObj = Storage.STRATEGIES.find(s => s.id === student.mundoActual) || Storage.STRATEGIES[0];
        const worldMastery = student.dominio[student.mundoActual] || 0;
        const lastResult = student.ultimaSesionCorrectas !== null
            ? `${student.ultimaSesionCorrectas}/${student.ultimaSesionTotal} correctas`
            : 'Sin sesiones aún';

        container.innerHTML = `
            <div class="card dashboard-hero">
                <h2>Hola, ${student.nombre}</h2>
                <div class="stat-row">
                    <div class="stat-box">
                        <div class="label">Mundo actual</div>
                        <div class="value">${worldObj.id}. ${worldObj.name}</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">Dominio del mundo</div>
                        <div class="value">${worldMastery}%</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">Última sesión</div>
                        <div class="value">${lastResult}</div>
                    </div>
                </div>
                <button id="btn-start-practice" class="btn-primary" style="width:100%; font-size:1.5rem; padding:20px;">
                    Continuar ▶
                </button>
            </div>
        `;

        document.getElementById('btn-start-practice').addEventListener('click', () => {
            sessionState = null;
            navigate('entrenamiento');
        });
    }

    function startOrResumeSession() {
        const student = Storage.getActiveStudent();
        if (!sessionState) {
            sessionState = {
                questions: Adaptive.buildSessionQuestions(student),
                currentIndex: 0,
                correctCount: 0,
                history: [],
                awaitingNext: false,
                startTime: Date.now()
            };
        }
        renderQuestion();
    }

    function renderQuestion() {
        const student = Storage.getActiveStudent();
        const q = sessionState.questions[sessionState.currentIndex];
        const strategyObj = Storage.STRATEGIES.find(s => s.id === q.strategyId);
        const answeredCount = sessionState.history.length;
        const accuracy = answeredCount > 0
            ? Math.round((sessionState.correctCount / answeredCount) * 100)
            : 100;

        const showHint = Adaptive.shouldTriggerPreventiveHelp(sessionState.history, q.strategyId);

        container.innerHTML = `
            <div class="practice-layout">
                <div class="card">
                    <div class="question-meta">
                        <span>Mundo ${strategyObj.id} · ${strategyObj.name}</span>
                        <span>Pregunta ${sessionState.currentIndex + 1} de 20</span>
                    </div>

                    ${showHint ? `
                        <div class="hint-banner">
                            💡 Pista: ${q.paso1}
                        </div>
                    ` : ''}

                    <div class="math-prompt">${q.prompt}</div>

                    <input type="number" id="answer-input" class="answer-input" placeholder="?" autocomplete="off" />

                    <button id="btn-check" class="btn-primary" style="width:100%;">Comprobar</button>

                    <div id="feedback-area"></div>

                    <div style="margin-top:18px; text-align:right; color:var(--text-muted); font-weight:600;">
                        Precisión sesión: ${accuracy}%
                    </div>
                </div>

                <div class="card">
                    <div class="keypad">
                        ${[7,8,9,4,5,6,1,2,3].map(n => `<button class="key-btn" data-key="${n}">${n}</button>`).join('')}
                        <button class="key-btn" data-key="clear">C</button>
                        <button class="key-btn" data-key="0">0</button>
                        <button class="key-btn" data-key="enter" style="background:var(--primary); color:white;">⏎</button>
                    </div>
                </div>
            </div>
        `;

        const input = document.getElementById('answer-input');
        const checkBtn = document.getElementById('btn-check');
        input.focus();

        function submitAnswer() {
            if (sessionState.awaitingNext) return;
            const val = parseInt(input.value, 10);
            if (isNaN(val)) return;

            sessionState.awaitingNext = true;
            const isCorrect = val === q.answer;
            if (isCorrect) sessionState.correctCount++;

            sessionState.history.push({ strategyId: q.strategyId, correct: isCorrect });
            Adaptive.registerAnswer(student, q, isCorrect);
            Storage.updateStudent(student);

            const feedbackArea = document.getElementById('feedback-area');
            checkBtn.style.display = 'none';
            input.disabled = true;

            if (isCorrect) {
                feedbackArea.innerHTML = `<div class="feedback-box feedback-success">✅ Correcto</div>`;
                setTimeout(nextQuestion, 700);
            } else {
                feedbackArea.innerHTML = `
                    <div class="feedback-box feedback-error">
                        <div style="font-size:1.3rem; font-weight:800; margin-bottom:10px;">❌ Vamos a verlo</div>
                        <div class="step-box">${q.paso1}</div>
                        <div class="step-box">${q.paso2}</div>
                        <button id="btn-continue-err" class="btn-primary" style="margin-top:12px; width:100%;">Continuar</button>
                    </div>
                `;
                document.getElementById('btn-continue-err').addEventListener('click', nextQuestion);
                document.getElementById('btn-continue-err').focus();
            }
        }

        function nextQuestion() {
            sessionState.awaitingNext = false;
            sessionState.currentIndex++;
            if (sessionState.currentIndex >= 20) {
                finishSession();
            } else {
                renderQuestion();
            }
        }

        checkBtn.addEventListener('click', submitAnswer);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitAnswer();
        });

        container.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (sessionState.awaitingNext) return;
                const key = btn.dataset.key;
                if (key === 'clear') input.value = '';
                else if (key === 'enter') submitAnswer();
                else input.value += key;
                input.focus();
            });
        });
    }

    function finishSession() {
        const student = Storage.getActiveStudent();
        student.ultimaSesionCorrectas = sessionState.correctCount;
        student.ultimaSesionTotal = 20;
        Storage.updateStudent(student);

        Storage.syncToCloud({
            alumno: student.nombre,
            mundoActual: student.mundoActual,
            aciertos: sessionState.correctCount,
            dominio: student.dominio,
            fecha: new Date().toISOString()
        });

        const score = sessionState.correctCount;
        sessionState = null;

        container.innerHTML = `
            <div class="card dashboard-hero">
                <h2>🎉 ¡Sesión completada!</h2>
                <div class="math-prompt" style="color:var(--primary);">${score} / 20</div>
                <p style="font-size:1.2rem; margin-bottom:24px;">Has terminado tu entrenamiento de hoy.</p>
                <button id="btn-back-home" class="btn-primary">Volver a Inicio</button>
            </div>
        `;

        document.getElementById('btn-back-home').addEventListener('click', () => navigate('inicio'));
    }

    function renderProgress() {
        const student = Storage.getActiveStudent();
        container.innerHTML = `
            <div class="card">
                <h2 style="margin-bottom:20px;">Dominio por estrategia</h2>
                ${Storage.STRATEGIES.map(s => {
                    const pct = student.dominio[s.id] || 0;
                    const label = Adaptive.getMasteryLabel(pct);
                    return `
                        <div class="strategy-row">
                            <div class="strategy-header">
                                <span>${s.id}.${s.name}</span>
                                <span>${pct}\% ·${label}</span>
                            </div>
                            <div class="progress-track">
                                <div class="progress-fill" style="width:${pct}%;"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderTeacherPanel() {
        const pin = prompt('Introduce el PIN de profesor (por defecto: 1234):');
        if (pin !== '1234') {
            navigate('inicio');
            return;
        }
        currentView = 'profesor';
        updateHeader();

        const db = Storage.getDatabase();
        const students = Object.values(db.students);

        container.innerHTML = `
            <div class="card" style="overflow-x:auto;">
                <h2>👨‍🏫 Panel del Profesor · 3ºB Hermandad del Dragón</h2>
                <p class="subtitle" style="margin-bottom:16px;">Haz clic en el nombre de un alumno para renombrarlo o en su Mundo para cambiarlo de nivel (1 a 8).</p>
                <table class="teacher-table">
                    <thead>
                        <tr>
                            <th>Alumno</th>
                            <th>Mundo</th>
                            <th>Última</th>
                            ${Storage.STRATEGIES.map(s => `<th>E${s.id}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(st => `
                            <tr>
                                <td>
                                    <button class="btn-outline btn-rename" data-id="${st.id}" style="width:100%;">
                                        ✏️ ${st.nombre}
                                    </button>
                                </td>
                                <td>
                                    <button class="btn-secondary btn-world" data-id="${st.id}" title="Cambiar mundo">
                                        Mundo ${st.mundoActual} 🔄
                                    </button>
                                </td>
                                <td>${st.ultimaSesionCorrectas !== null ? st.ultimaSesionCorrectas + '/20' : '-'}</td>
                                ${Storage.STRATEGIES.map(s => `<td>${st.dominio[s.id] || 0}%</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll('.btn-rename').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const current = db.students[id].nombre;
                const nuevo = prompt('Nuevo nombre para el alumno:', current);
                if (nuevo) {
                    Storage.renameStudent(id, nuevo);
                    renderTeacherPanel();
                }
            });
        });

        container.querySelectorAll('.btn-world').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const student = db.students[id];
                const nuevoMundo = parseInt(prompt(`¿A qué mundo (1 a 8) quieres mover a ${student.nombre}?`, student.mundoActual), 10);
                if (nuevoMundo >= 1 && nuevoMundo <= 8) {
                    student.mundoActual = nuevoMundo;
                    if (!student.dominio[nuevoMundo]) student.dominio[nuevoMundo] = 50;
                    Storage.updateStudent(student);
                    renderTeacherPanel();
                }
            });
        });
    }

    // Eventos globales
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.dataset.view));
    });

    document.getElementById('btn-change-student').addEventListener('click', () => {
        Storage.setActiveStudentId(null);
        renderStudentSelector();
    });

    document.getElementById('btn-teacher-panel').addEventListener('click', () => {
        renderTeacherPanel();
    });

    // Arranque inicial
    navigate('inicio');
});
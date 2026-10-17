import { DragonStorageService, STRATEGIES } from "./services/storage.js";
import { STRATEGY_LABELS, strategyByWorldIndex } from "./engine/generator.js";
import { buildSession, masteryLabel, shouldShowPreventiveHelp, updateWorldUnlock } from "./engine/adaptive.js";

const storage = new DragonStorageService();

const state = {
  view: "inicio",
  selectingStudent: !storage.getActiveStudentId(),
  activeStudent: storage.getActiveStudent(),
  session: null,
  sessionIndex: 0,
  sessionAnswers: [],
  currentInput: "",
  feedback: null,
  waitingContinue: false,
  sessionDoneMessage: ""
};

const views = {
  selector: document.getElementById("view-student-selector"),
  inicio: document.getElementById("view-inicio"),
  entrenamiento: document.getElementById("view-entrenamiento"),
  progreso: document.getElementById("view-progreso"),
  logros: document.getElementById("view-logros")
};

const activeStudentInfo = document.getElementById("active-student-info");
const changeStudentBtn = document.getElementById("change-student-btn");
const teacherPanelBtn = document.getElementById("teacher-panel-btn");
const navButtons = [...document.querySelectorAll(".nav-btn")];

const teacherPinModal = document.getElementById("teacher-pin-modal");
const teacherPinForm = document.getElementById("teacher-pin-form");
const teacherPinInput = document.getElementById("teacher-pin-input");
const teacherPinError = document.getElementById("teacher-pin-error");
const teacherPanelModal = document.getElementById("teacher-panel-modal");
const teacherPanelContent = document.getElementById("teacher-panel-content");

function masteryMap(student) {
  return STRATEGIES.reduce((acc, strategy) => {
    const item = student.strategyStats[strategy];
    const value = item.total === 0 ? 0 : Math.round((item.correct / item.total) * 100);
    acc[strategy] = value;
    return acc;
  }, {});
}

function refreshActiveStudent() {
  state.activeStudent = storage.getActiveStudent();
}

function setView(view) {
  state.view = view;
  render();
}

function setSelectingStudent(value) {
  state.selectingStudent = value;
  render();
}

function renderHeader() {
  const student = state.activeStudent;
  activeStudentInfo.textContent = student ? `${student.name}` : "Sin alumno";
  changeStudentBtn.disabled = !student;
}

function renderNav() {
  const canNavigate = !!state.activeStudent;
  navButtons.forEach((btn) => {
    const target = btn.dataset.view;
    btn.disabled = !canNavigate;
    btn.classList.toggle("active", !state.selectingStudent && state.view === target);
  });
}

function renderStudentSelector() {
  const students = storage.getAllStudents();
  views.selector.classList.toggle("active", state.selectingStudent);

  if (!state.selectingStudent) {
    views.selector.innerHTML = "";
    return;
  }

  const buttons = students
    .map((student) => `<button type="button" class="student-btn" data-student-id="${student.id}">${student.name}</button>`)
    .join("");

  views.selector.innerHTML = `
    <div class="card">
      <h2>Elige tu perfil</h2>
      <p>Selecciona tu alumno para continuar.</p>
      <div class="student-grid">${buttons}</div>
    </div>
  `;

  views.selector.querySelectorAll("[data-student-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.studentId;
      storage.setActiveStudentId(id);
      refreshActiveStudent();
      state.view = "inicio";
      setSelectingStudent(false);
    });
  });
}

function renderInicio() {
  views.inicio.classList.toggle("active", !state.selectingStudent && state.view === "inicio");
  if (!state.activeStudent || state.selectingStudent) {
    views.inicio.innerHTML = "";
    return;
  }

  const student = state.activeStudent;
  const strategy = strategyByWorldIndex(student.mundoActual);
  const mastery = masteryMap(student)[strategy];

  views.inicio.innerHTML = `
    <div class="card">
      <h2>Inicio</h2>
      <p><strong>Mundo actual:</strong> ${STRATEGY_LABELS[strategy]}</p>
      <div class="progress-item">
        <div class="progress-meta"><span>Progreso del mundo</span><span>${mastery}%</span></div>
        <div class="progress-bar"><span style="width:${mastery}%"></span></div>
      </div>
      <div class="kpi-grid">
        <div class="kpi"><strong>Última sesión</strong><br>${student.lastSessionScore ?? "Sin sesiones"}</div>
        <div class="kpi"><strong>Sesiones</strong><br>${student.sessionsCompleted}</div>
        <div class="kpi"><strong>Escala</strong><br>${masteryLabel(mastery)}</div>
      </div>
      ${state.sessionDoneMessage ? `<p class="feedback success">${state.sessionDoneMessage}</p>` : ""}
      <div style="margin-top:1rem;display:flex;justify-content:flex-end;">
        <button id="go-training" class="btn" type="button">Continuar</button>
      </div>
    </div>
  `;

  const goTraining = document.getElementById("go-training");
  goTraining?.addEventListener("click", () => {
    state.sessionDoneMessage = "";
    setView("entrenamiento");
  });
}

function ensureSession() {
  if (!state.session) {
    state.session = buildSession(state.activeStudent);
    state.sessionIndex = 0;
    state.sessionAnswers = [];
    state.feedback = null;
    state.waitingContinue = false;
    state.currentInput = "";
  }
}

function resetSessionState() {
  state.session = null;
  state.sessionIndex = 0;
  state.sessionAnswers = [];
  state.feedback = null;
  state.waitingContinue = false;
  state.currentInput = "";
}

function getCurrentQuestion() {
  return state.session?.[state.sessionIndex] ?? null;
}

function completeSession() {
  const payload = { answers: state.sessionAnswers };
  const updated = storage.recordSessionResult(state.activeStudent.id, payload);
  if (updated) {
    const unlocked = updateWorldUnlock(updated);
    storage.updateStudent(updated.id, () => unlocked);
  }

  refreshActiveStudent();
  const correct = state.sessionAnswers.filter((entry) => entry.correct).length;
  state.sessionDoneMessage = `Sesión completada: ${correct}/20 correctas`;
  resetSessionState();
  setView("inicio");
}

function appendDigit(value) {
  if (state.waitingContinue) {
    return;
  }
  state.currentInput = `${state.currentInput}${value}`;
  renderEntrenamiento();
}

function deleteDigit() {
  if (state.waitingContinue) {
    return;
  }
  state.currentInput = state.currentInput.slice(0, -1);
  renderEntrenamiento();
}

function evaluateAnswer() {
  const question = getCurrentQuestion();
  if (!question || state.waitingContinue) {
    return;
  }

  const userValue = Number(state.currentInput);
  if (!Number.isFinite(userValue)) {
    state.feedback = { type: "error", text: "Escribe un número para comprobar." };
    renderEntrenamiento();
    return;
  }

  const correct = userValue === question.respuesta;
  const answerEntry = {
    strategy: question.strategy,
    correct,
    userAnswer: userValue,
    expectedAnswer: question.respuesta
  };
  state.sessionAnswers.push(answerEntry);

  if (correct) {
    state.feedback = { type: "success", text: "✅ Correcto" };
    state.waitingContinue = true;
    renderEntrenamiento();

    window.setTimeout(() => {
      state.sessionIndex += 1;
      state.currentInput = "";
      state.feedback = null;
      state.waitingContinue = false;
      if (state.sessionIndex >= 20) {
        completeSession();
      } else {
        renderEntrenamiento();
      }
    }, 700);
    return;
  }

  state.feedback = {
    type: "error",
    text: "❌ Vamos a verlo",
    paso1: question.paso1,
    paso2: question.paso2
  };
  state.waitingContinue = true;
  renderEntrenamiento();
}

function continueAfterError() {
  if (!state.waitingContinue) {
    return;
  }
  state.sessionIndex += 1;
  state.currentInput = "";
  state.feedback = null;
  state.waitingContinue = false;

  if (state.sessionIndex >= 20) {
    completeSession();
    return;
  }

  renderEntrenamiento();
}

function renderEntrenamiento() {
  views.entrenamiento.classList.toggle("active", !state.selectingStudent && state.view === "entrenamiento");
  if (!state.activeStudent || state.selectingStudent || state.view !== "entrenamiento") {
    views.entrenamiento.innerHTML = "";
    return;
  }

  if (!state.session) {
    views.entrenamiento.innerHTML = `
      <div class="card">
        <h2>Entrenamiento</h2>
        <p>Sesión de 20 ejercicios.</p>
        <button id="start-session" class="btn" type="button">Ejercicios</button>
      </div>
    `;

    document.getElementById("start-session")?.addEventListener("click", () => {
      ensureSession();
      renderEntrenamiento();
    });

    return;
  }

  const question = getCurrentQuestion();
  if (!question) {
    views.entrenamiento.innerHTML = "";
    return;
  }

  const preventiveHelp = shouldShowPreventiveHelp(state.sessionAnswers, question.strategy)
    ? `
      <div class="feedback help">
        <strong>Pista:</strong><br>
        ${question.paso1}<br>
        ${question.paso2}
      </div>
    `
    : "";

  const feedbackBlock = state.feedback
    ? `
      <div class="feedback ${state.feedback.type}">
        ${state.feedback.text}
        ${state.feedback.paso1 ? `<br>${state.feedback.paso1}` : ""}
        ${state.feedback.paso2 ? `<br>${state.feedback.paso2}` : ""}
      </div>
      ${state.feedback.type === "error" ? `<button id="continue-error" class="btn" type="button">Continuar</button>` : ""}
    `
    : "";

  views.entrenamiento.innerHTML = `
    <div class="practice-shell card">
      <div class="progress-meta">
        <span>Ejercicio ${state.sessionIndex + 1}/20</span>
        <span>${STRATEGY_LABELS[question.strategy]}</span>
      </div>
      ${preventiveHelp}
      <div class="practice-question">${question.enunciado}</div>
      <div class="answer-row">
        <input class="answer-input" id="answer-input" value="${state.currentInput}" inputmode="numeric" ${state.waitingContinue ? "disabled" : ""} />
        <button id="check-btn" class="btn" type="button" ${state.waitingContinue ? "disabled" : ""}>Comprobar</button>
      </div>
      <div class="numpad">
        ${[1,2,3,4,5,6,7,8,9].map((n) => `<button type="button" data-digit="${n}" ${state.waitingContinue ? "disabled" : ""}>${n}</button>`).join("")}
        <button type="button" id="pad-clear" ${state.waitingContinue ? "disabled" : ""}>Borrar</button>
        <button type="button" data-digit="0" ${state.waitingContinue ? "disabled" : ""}>0</button>
        <button type="button" id="pad-enter">Enter</button>
      </div>
      ${feedbackBlock}
    </div>
  `;

  const input = document.getElementById("answer-input");
  const checkBtn = document.getElementById("check-btn");
  input?.addEventListener("input", (event) => {
    state.currentInput = event.target.value.replace(/[^0-9-]/g, "");
  });
  checkBtn?.addEventListener("click", evaluateAnswer);

  views.entrenamiento.querySelectorAll("[data-digit]").forEach((button) => {
    button.addEventListener("click", () => appendDigit(button.dataset.digit));
  });

  document.getElementById("pad-clear")?.addEventListener("click", deleteDigit);
  document.getElementById("pad-enter")?.addEventListener("click", () => {
    if (state.feedback?.type === "error") {
      continueAfterError();
    } else {
      evaluateAnswer();
    }
  });

  document.getElementById("continue-error")?.addEventListener("click", continueAfterError);
}

function renderProgreso() {
  views.progreso.classList.toggle("active", !state.selectingStudent && state.view === "progreso");
  if (!state.activeStudent || state.selectingStudent) {
    views.progreso.innerHTML = "";
    return;
  }

  const mastery = masteryMap(state.activeStudent);
  const rows = STRATEGIES.map((strategy) => {
    const value = mastery[strategy];
    return `
      <div class="progress-item">
        <div class="progress-meta">
          <span>${STRATEGY_LABELS[strategy]}</span>
          <span>${value}% · ${masteryLabel(value)}</span>
        </div>
        <div class="progress-bar"><span style="width:${value}%"></span></div>
      </div>
    `;
  }).join("");

  views.progreso.innerHTML = `<div class="card"><h2>Progreso</h2><div class="progress-list">${rows}</div></div>`;
}

function renderLogros() {
  views.logros.classList.toggle("active", !state.selectingStudent && state.view === "logros");
  if (!state.activeStudent || state.selectingStudent) {
    views.logros.innerHTML = "";
    return;
  }

  const mastery = masteryMap(state.activeStudent);
  const achievements = [
    { key: "amigos10", title: "Amigo del 10", unlocked: mastery.amigos10 >= 80 },
    { key: "amigos100", title: "Constructor del 100", unlocked: mastery.amigos100 >= 80 },
    { key: "masMenos9", title: "Maestro del +9", unlocked: mastery.masMenos9 >= 80 },
    { key: "masMenos11", title: "Explorador del 1000", unlocked: mastery.masMenos11 >= 80 }
  ];

  views.logros.innerHTML = `
    <div class="card">
      <h2>Logros</h2>
      <div class="achievement-grid">
        ${achievements
          .map(
            (item) => `<div class="achievement ${item.unlocked ? "done" : ""}">${item.unlocked ? "✓" : "□"} ${item.title}</div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function openTeacherPanel() {
  const rows = storage
    .getAllStudents()
    .map((student) => {
      const mastery = masteryMap(student);
      return `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.mundoActual + 1}</td>
          <td>${student.lastSessionScore ?? "-"}</td>
          <td>${student.sessionsCompleted}</td>
          <td>${STRATEGIES.map((s) => `${STRATEGY_LABELS[s]}: ${mastery[s]}%`).join(" | ")}</td>
        </tr>
      `;
    })
    .join("");

  teacherPanelContent.innerHTML = `
    <h2>Panel Profesor</h2>
    <div class="teacher-table-wrap">
      <table class="teacher-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Alumno</th>
            <th>Mundo</th>
            <th>Última sesión</th>
            <th>Sesiones</th>
            <th>Dominio por estrategia</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="modal-actions">
      <button id="export-json" class="btn btn-secondary" type="button">Exportar JSON</button>
      <button id="export-csv" class="btn btn-secondary" type="button">Exportar CSV</button>
      <label class="btn btn-secondary" for="import-data">Importar JSON/CSV</label>
      <input id="import-data" type="file" accept=".json,.csv" style="display:none" />
      <button id="close-teacher-panel" class="btn" type="button">Cerrar</button>
    </div>
  `;

  if (!teacherPanelModal.open) {
    teacherPanelModal.showModal();
  }

  document.getElementById("export-json")?.addEventListener("click", () => {
    downloadFile("dragon-data.json", storage.exportJson(), "application/json");
  });

  document.getElementById("export-csv")?.addEventListener("click", () => {
    downloadFile("dragon-data.csv", storage.exportCsv(), "text/csv");
  });

  document.getElementById("import-data")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    if (file.name.toLowerCase().endsWith(".json") || text.trim().startsWith("{")) {
      storage.importJson(text);
    } else {
      storage.importCsv(text);
    }

    refreshActiveStudent();
    render();
    openTeacherPanel();
  });

  document.getElementById("close-teacher-panel")?.addEventListener("click", () => {
    teacherPanelModal.close();
  });
}

function render() {
  renderHeader();
  renderNav();
  renderStudentSelector();
  renderInicio();
  renderEntrenamiento();
  renderProgreso();
  renderLogros();
}

changeStudentBtn.addEventListener("click", () => {
  storage.setActiveStudentId("");
  refreshActiveStudent();
  resetSessionState();
  setSelectingStudent(true);
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!state.activeStudent) {
      return;
    }
    setView(button.dataset.view);
  });
});

teacherPanelBtn.addEventListener("click", () => {
  teacherPinInput.value = "";
  teacherPinError.textContent = "";
  teacherPinModal.showModal();
});

teacherPinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (teacherPinInput.value !== "1234") {
    teacherPinError.textContent = "PIN incorrecto";
    return;
  }

  teacherPinModal.close();
  openTeacherPanel();
});

document.addEventListener("keydown", (event) => {
  if (state.selectingStudent || state.view !== "entrenamiento" || !state.session) {
    return;
  }
  if (event.key === "Enter") {
    if (state.feedback?.type === "error") {
      continueAfterError();
    } else {
      evaluateAnswer();
    }
  }
});

render();

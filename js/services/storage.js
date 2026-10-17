const DATA_KEY = "dragon_data_v1";
const ACTIVE_STUDENT_KEY = "dragon_active_student_id";

export const STRATEGIES = [
  "amigos10",
  "amigos100",
  "decena",
  "resta",
  "dobles",
  "casiDobles",
  "masMenos9",
  "masMenos11"
];

const DEFAULT_NAMES = Array.from({ length: 25 }, (_, i) => `Alumno ${i + 1}`);

function createDefaultStudent(id, name) {
  return {
    id: String(id),
    name,
    mundoActual: 0,
    lastSessionScore: null,
    sessionsCompleted: 0,
    strategyStats: STRATEGIES.reduce((acc, key) => {
      acc[key] = { correct: 0, total: 0, streakErrors: 0 };
      return acc;
    }, {}),
    sessions: []
  };
}

function createDefaultData() {
  const students = {};
  DEFAULT_NAMES.forEach((name, index) => {
    const id = String(index + 1);
    students[id] = createDefaultStudent(id, name);
  });
  return { students, meta: { version: 1 } };
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export class DragonStorageService {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    const raw = localStorage.getItem(DATA_KEY);
    const parsed = raw ? safeParse(raw) : null;
    if (parsed?.students) {
      return parsed;
    }
    const seed = createDefaultData();
    localStorage.setItem(DATA_KEY, JSON.stringify(seed));
    return seed;
  }

  saveData() {
    localStorage.setItem(DATA_KEY, JSON.stringify(this.data));
  }

  getAllStudents() {
    return Object.values(this.data.students).sort((a, b) => Number(a.id) - Number(b.id));
  }

  getActiveStudentId() {
    return localStorage.getItem(ACTIVE_STUDENT_KEY);
  }

  setActiveStudentId(id) {
    localStorage.setItem(ACTIVE_STUDENT_KEY, String(id));
  }

  getStudent(id) {
    return this.data.students[String(id)] ?? null;
  }

  getActiveStudent() {
    const activeId = this.getActiveStudentId();
    return activeId ? this.getStudent(activeId) : null;
  }

  updateStudent(id, updater) {
    const key = String(id);
    if (!this.data.students[key]) {
      return null;
    }
    const updated = updater(structuredClone(this.data.students[key]));
    this.data.students[key] = updated;
    this.saveData();
    return updated;
  }

  getMasteryForStudent(student) {
    return STRATEGIES.reduce((acc, strategy) => {
      const stats = student.strategyStats[strategy];
      const mastery = stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100);
      acc[strategy] = mastery;
      return acc;
    }, {});
  }

  recordSessionResult(studentId, sessionPayload) {
    const nowIso = new Date().toISOString();
    const student = this.updateStudent(studentId, (draft) => {
      const correctCount = sessionPayload.answers.filter((a) => a.correct).length;
      draft.lastSessionScore = `${correctCount}/20 correctas`;
      draft.sessionsCompleted += 1;
      sessionPayload.answers.forEach((answer) => {
        const stats = draft.strategyStats[answer.strategy];
        if (!stats) {
          return;
        }
        stats.total += 1;
        if (answer.correct) {
          stats.correct += 1;
          stats.streakErrors = 0;
        } else {
          stats.streakErrors += 1;
        }
      });

      draft.sessions.push({
        id: `${draft.id}-${Date.now()}`,
        timestamp: nowIso,
        result: draft.lastSessionScore,
        answers: sessionPayload.answers
      });
      draft.sessions = draft.sessions.slice(-30);
      return draft;
    });

    if (student) {
      this.syncToCloud({
        studentId: student.id,
        timestamp: nowIso,
        lastSessionScore: student.lastSessionScore,
        answers: sessionPayload.answers
      });
    }

    return student;
  }

  async syncToCloud(sessionPayload) {
    const endpoint = localStorage.getItem("dragon_cloud_webhook");
    if (!endpoint) {
      return { status: "skipped" };
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionPayload)
      });
      return { status: response.ok ? "ok" : "error", code: response.status };
    } catch {
      return { status: "error" };
    }
  }

  exportJson() {
    return JSON.stringify(this.data, null, 2);
  }

  exportCsv() {
    const header = ["id", "name", "mundoActual", "lastSessionScore", "sessionsCompleted", ...STRATEGIES].join(",");
    const rows = this.getAllStudents().map((student) => {
      const mastery = this.getMasteryForStudent(student);
      const strategyCells = STRATEGIES.map((key) => mastery[key]);
      return [
        student.id,
        `"${student.name.replaceAll('"', '""')}"`,
        student.mundoActual,
        student.lastSessionScore ?? "",
        student.sessionsCompleted,
        ...strategyCells
      ].join(",");
    });

    return [header, ...rows].join("\n");
  }

  importJson(jsonText) {
    const parsed = safeParse(jsonText);
    if (!parsed?.students) {
      throw new Error("JSON no válido");
    }
    this.data = parsed;
    this.saveData();
  }

  importCsv(csvText) {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length <= 1) {
      throw new Error("CSV no válido");
    }
    const [, ...rows] = lines;

    rows.forEach((row) => {
      const columns = row.match(/("[^"]*"|[^,]+)/g)?.map((cell) => cell.replace(/^"|"$/g, "")) ?? [];
      const [id, name, mundoActual, lastSessionScore, sessionsCompleted] = columns;
      if (!id) {
        return;
      }

      this.updateStudent(id, (draft) => {
        draft.name = name || draft.name;
        draft.mundoActual = Number.isFinite(Number(mundoActual)) ? Number(mundoActual) : draft.mundoActual;
        draft.lastSessionScore = lastSessionScore || draft.lastSessionScore;
        draft.sessionsCompleted = Number.isFinite(Number(sessionsCompleted))
          ? Number(sessionsCompleted)
          : draft.sessionsCompleted;
        return draft;
      });
    });

    this.saveData();
  }
}

window.DragonApp = window.DragonApp || {};

(function () {
    const STORAGE_KEY = 'dragon_data_v2';
    const ACTIVE_STUDENT_KEY = 'dragon_active_student_id_v2';

    // URL oficial de tu flujo verificado en Power Automate (Educacyl)
    const DEFAULT_WEBHOOK_URL = 'https://default669222eed5e54539987ea3015ab6df.31.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/02/workflows/316fe2de303941ffa428ceacf145e8cd/triggers/manual/paths/invoke?api-version=1';

    const STRATEGIES = [
        { id: 1, name: 'Amigos del 10', targetExercises: 60 },
        { id: 2, name: 'Amigos del 100', targetExercises: 60 },
        { id: 3, name: 'Llegar a la decena', targetExercises: 70 },
        { id: 4, name: 'Restas inteligentes', targetExercises: 70 },
        { id: 5, name: 'Dobles', targetExercises: 50 },
        { id: 6, name: 'Casi dobles', targetExercises: 50 },
        { id: 7, name: '+9 y -9', targetExercises: 60 },
        { id: 8, name: '+11 y -11', targetExercises: 60 }
    ];

    const STUDENT_NAMES = [
        'ISRAEL', 'MARCO', 'ELI', 'ANDREA', 'ISHAK', 'CARMEN', 
        'ARIANNA', 'ANGEL', 'MARTA', 'LYAM', 'JUAN ANTONIO', 
        'HUGO', 'Noah', 'ROMAYS', 'OMAR', 'ADRIAN', 'OONA', 
        'MOUNA', 'KIKO', 'ALICIA', 'ADAM', 'ARABIA'
    ];

    const DEFAULT_STUDENTS = STUDENT_NAMES.map((nombre, i) => ({
        id: `alumno_${i + 1}`,
        nombre: nombre
    }));

    function createInitialStudentData(id, nombre) {
        const dominio = {};
        const contadores = {};
        STRATEGIES.forEach(s => {
            dominio[s.id] = s.id === 1 ? 50 : 0;
            contadores[s.id] = 0;
        });

        return {
            id,
            nombre,
            mundoActual: 1,
            ultimaSesionCorrectas: null,
            ultimaSesionTotal: 20,
            dominio,
            contadores,
            historial: [],
            logros: []
        };
    }

    function loadDatabase() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const db = JSON.parse(raw);
                if (!db.webhookUrl) db.webhookUrl = DEFAULT_WEBHOOK_URL;
                return db;
            }
        } catch (e) {
            console.error('Error leyendo localStorage:', e);
        }

        const initialDb = { students: {}, webhookUrl: DEFAULT_WEBHOOK_URL };
        DEFAULT_STUDENTS.forEach(st => {
            initialDb.students[st.id] = createInitialStudentData(st.id, st.nombre);
        });
        saveDatabase(initialDb);
        return initialDb;
    }

    function saveDatabase(db) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        } catch (e) {
            console.error('Error guardando localStorage:', e);
        }
    }

    window.DragonApp.Storage = {
        STRATEGIES,
        getDatabase: loadDatabase,
        saveDatabase,

        getActiveStudentId() {
            return localStorage.getItem(ACTIVE_STUDENT_KEY);
        },

        setActiveStudentId(id) {
            if (id) {
                localStorage.setItem(ACTIVE_STUDENT_KEY, id);
            } else {
                localStorage.removeItem(ACTIVE_STUDENT_KEY);
            }
        },

        getActiveStudent() {
            const id = this.getActiveStudentId();
            if (!id) return null;
            const db = loadDatabase();
            return db.students[id] || null;
        },

        updateStudent(studentData) {
            const db = loadDatabase();
            db.students[studentData.id] = studentData;
            saveDatabase(db);
        },

        renameStudent(id, newName) {
            const db = loadDatabase();
            if (db.students[id] && newName.trim()) {
                db.students[id].nombre = newName.trim().toUpperCase();
                saveDatabase(db);
            }
        },

        setWebhookUrl(url) {
            const db = loadDatabase();
            db.webhookUrl = url ? url.trim() : '';
            saveDatabase(db);
        },

        async syncToCloud(sessionPayload) {
            const db = loadDatabase();
            const url = db.webhookUrl || DEFAULT_WEBHOOK_URL;
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionPayload)
                });
            } catch (err) {
                console.warn('No se pudo sincronizar con la nube:', err);
            }
        }
    };
})();
window.DragonApp = window.DragonApp || {};

(function () {
    const STORAGE_KEY = 'dragon_data_local_v2';
    const ACTIVE_STUDENT_KEY = 'dragon_active_student_local_v1';

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

    const DEFAULT_STUDENTS = Array.from({ length: 22 }, (_, i) => {
        const num = (i + 1).toString().padStart(2, '0');
        return {
            id: `dragon_${num}`,
            nombre: `DRAGON ${num}`
        };
    });

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
            tiempoMedioSeg: null,
            dominio,
            contadores,
            historial: [],
            logros: []
        };
    }

    function loadDatabase() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error('Error leyendo localStorage:', e);
        }

        const initialDb = { students: {} };
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

        exportToCSV() {
            const db = loadDatabase();
            const students = Object.values(db.students);
            
            let csv = 'Identificador;Mundo Actual;Ultima Sesion;Tiempo Medio (s);Dom E1;Dom E2;Dom E3;Dom E4;Dom E5;Dom E6;Dom E7;Dom E8\n';
            
            students.forEach(st => {
                const aciertos = st.ultimaSesionCorrectas !== null ? `${st.ultimaSesionCorrectas}/20` : '-';
                const tiempo = st.tiempoMedioSeg !== null ? st.tiempoMedioSeg : '-';
                const doms = STRATEGIES.map(s => `${st.dominio[s.id] || 0}%`).join(';');
                csv += `${st.nombre};${st.mundoActual};${aciertos};${tiempo};${doms}\n`;
            });

            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `progreso_dragon_3B_${new Date().toISOString().slice(0, 10)}.csv`;
            link.click();
        }
    };
})();
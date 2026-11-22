window.DragonApp = window.DragonApp || {};

(function () {
    const STORAGE_KEY = 'dragon_data_local_v2';
    const PIN_SECRET = '5210';

    function createDefaultData() {
        return {
            name: '',
            modoRecuperacion: false,
            progresoMath: {},
            progresoLengua: {},
            misterioProgreso: {},
            sesiones: [],
            actividadesCompletadas: []
        };
    }

    function normalizeData(rawData) {
        let source = rawData && typeof rawData === 'object' ? rawData : {};
        if (Array.isArray(source.students)) {
            source = source.students[0] || {};
        }

        let name = typeof source.name === 'string' ? source.name.trim().slice(0, 20) : '';
        if (name === 'Dragón' || /^DRAGON\s+\d+$/i.test(name)) {
            name = '';
        }

        return {
            name,
            modoRecuperacion: Boolean(source.modoRecuperacion),
            progresoMath: source.progresoMath && typeof source.progresoMath === 'object' ? source.progresoMath : {},
            progresoLengua: source.progresoLengua && typeof source.progresoLengua === 'object' ? source.progresoLengua : {},
            misterioProgreso: source.misterioProgreso && typeof source.misterioProgreso === 'object' ? source.misterioProgreso : {},
            sesiones: Array.isArray(source.sesiones) ? source.sesiones : [],
            actividadesCompletadas: Array.isArray(source.actividadesCompletadas)
                ? source.actividadesCompletadas
                : []
        };
    }

    function saveData(data) {
        const normalized = normalizeData(data);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } catch (error) {
            console.error('No se pudieron guardar los datos del alumno.', error);
            throw error;
        }
        return normalized;
    }

    function getData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return createDefaultData();
            }
            const normalized = normalizeData(JSON.parse(raw));
            if (!raw || JSON.stringify(normalized) !== JSON.stringify(JSON.parse(raw))) {
                saveData(normalized);
            }
            return normalized;
        } catch (error) {
            console.error('No se pudieron leer los datos guardados.', error);
            return createDefaultData();
        }
    }

    function setStudentName(name) {
        const data = getData();
        data.name = String(name || '').trim().slice(0, 20);
        return saveData(data);
    }

    function setRecuperacion(enabled) {
        const data = getData();
        data.modoRecuperacion = Boolean(enabled);
        return saveData(data);
    }

    function updateProgress(subject, strategyId, isCorrect) {
        const data = getData();
        const property = subject === 'lengua' ? 'progresoLengua' : 'progresoMath';
        const id = String(strategyId);
        const record = data[property][id] || { intentos: 0, aciertos: 0, dominio: 0 };

        record.intentos = Number(record.intentos) + 1;
        if (isCorrect) record.aciertos = Number(record.aciertos) + 1;
        record.dominio = Math.round((record.aciertos / record.intentos) * 100);
        data[property][id] = record;
        data.sesiones.push({
            fecha: new Date().toISOString(),
            subject,
            strategyId,
            isCorrect: Boolean(isCorrect)
        });
        return saveData(data);
    }

    function updateMysteryProgress(storyId, paragraphIndex) {
        const data = getData();
        const id = String(storyId);
        data.misterioProgreso[id] = Math.max(
            Number(data.misterioProgreso[id]) || 0,
            Number(paragraphIndex) || 0
        );
        return saveData(data);
    }

    function completeActivity(subject, strategyId, score, total) {
        const data = getData();
        const safeTotal = Math.max(1, Number(total) || 1);
        const safeScore = Math.max(0, Math.min(safeTotal, Number(score) || 0));
        data.actividadesCompletadas.push({
            fecha: new Date().toISOString(),
            subject: subject === 'lengua' ? 'lengua' : 'math',
            strategyId: Number(strategyId),
            score: safeScore,
            total: safeTotal,
            superada: safeScore / safeTotal >= 0.8
        });
        return saveData(data);
    }

    function getPassedActivities(data = getData()) {
        return (data.actividadesCompletadas || []).filter(activity => activity.superada);
    }

    function getStoryUnlockStatus(data = getData()) {
        const passed = getPassedActivities(data);
        const mathActivities = passed.filter(activity => activity.subject === 'math').length;
        const languageActivities = passed.filter(activity => activity.subject === 'lengua').length;
        const unlockedStories = Math.min(6, Math.floor(mathActivities / 2), Math.floor(languageActivities / 2));
        const nextTarget = Math.min(12, (unlockedStories + 1) * 2);
        const missingMath = unlockedStories >= 6 ? 0 : Math.max(0, nextTarget - mathActivities);
        const missingLanguage = unlockedStories >= 6 ? 0 : Math.max(0, nextTarget - languageActivities);

        return {
            mathActivities,
            languageActivities,
            unlockedStories,
            missingMath,
            missingLanguage,
            canCreate: unlockedStories > 0,
            nextStoryReady: missingMath === 0 && missingLanguage === 0
        };
    }

    function getMasteredStrategies(data = getData()) {
        const unique = new Map();
        getPassedActivities(data).forEach(activity => {
            const subject = activity.subject;
            const strategyId = Number(activity.strategyId);
            unique.set(`${subject}:${strategyId}`, { subject, strategyId });
        });
        return [...unique.values()];
    }

    function resetData() {
        return saveData(createDefaultData());
    }

    function csvCell(value) {
        return `"${String(value).replace(/"/g, '""')}"`;
    }

    function exportCSV() {
        const data = getData();
        const rows = [
            ['Alumno', 'Asignatura', 'Categoría', 'Intentos', 'Aciertos', 'Dominio']
        ];

        [
            ['Matemáticas', data.progresoMath],
            ['Lengua', data.progresoLengua]
        ].forEach(([subject, progress]) => {
            Object.entries(progress).forEach(([strategyId, record]) => {
                rows.push([
                    data.name,
                    subject,
                    strategyId,
                    record.intentos || 0,
                    record.aciertos || 0,
                    `${record.dominio || 0}%`
                ]);
            });
        });

        const csv = '\uFEFF' + rows.map(row => row.map(csvCell).join(';')).join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const safeName = (data.name || 'alumno').replace(/[^a-z0-9áéíóúüñ_-]+/gi, '_');
        link.href = url;
        link.download = `progreso_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    window.DragonApp.Storage = {
        STORAGE_KEY,
        PIN_SECRET,
        getData,
        saveData,
        setStudentName,
        setRecuperacion,
        setModoRecuperacion: setRecuperacion,
        updateProgress,
        updateMysteryProgress,
        completeActivity,
        getStoryUnlockStatus,
        getMasteredStrategies,
        resetData,
        exportCSV
    };
})();

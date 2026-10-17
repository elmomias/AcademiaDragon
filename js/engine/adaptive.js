window.DragonApp = window.DragonApp || {};

(function () {
    const ACHIEVEMENTS = [
        { id: 'amigo_10', title: 'Amigo del 10', desc: 'Dominio >= 80% en Amigos del 10', strategyId: 1 },
        { id: 'constructor_100', title: 'Constructor del 100', desc: 'Dominio >= 80% en Amigos del 100', strategyId: 2 },
        { id: 'saltador_decenas', title: 'Saltador de decenas', desc: 'Dominio >= 80% en Llegar a la decena', strategyId: 3 },
        { id: 'restas_pro', title: 'Maestro de la Resta', desc: 'Dominio >= 80% en Restas inteligentes', strategyId: 4 },
        { id: 'dobles_pro', title: 'Rey de los Dobles', desc: 'Dominio >= 80% en Dobles y Casi dobles', strategyId: 5 },
        { id: 'maestro_9', title: 'Maestro del +9', desc: 'Dominio >= 80% en +9 y -9', strategyId: 7 },
        { id: 'explorador_1000', title: 'Explorador del 1000', desc: 'Completa los 8 mundos con >= 80%', strategyId: 8 }
    ];

    function getMasteryLabel(score) {
        if (score >= 95) return 'Dominio';
        if (score >= 80) return 'Competente';
        if (score >= 60) return 'En desarrollo';
        return 'Necesita ayuda';
    }

    function buildSessionQuestions(student) {
        const gen = window.DragonApp.Generator;
        const currentWorld = student.mundoActual || 1;
        const unlockedIds = [1, 2, 3, 4, 5, 6, 7, 8].filter(id => id <= currentWorld);

        // Ordenar estrategias desbloqueadas de más débil a más fuerte (40/30/20/10)
        const sortedByWeakness = [...unlockedIds].sort(
            (a, b) => (student.dominio[a] || 0) - (student.dominio[b] || 0)
        );

        const w1 = sortedByWeakness[0] || currentWorld;
        const w2 = sortedByWeakness[1] || currentWorld;
        const w3 = sortedByWeakness[2] || w1;

        const questions = [];

        // 1. 5 ejercicios de repaso (ponderados 40/30/20/10)
        const reviewPool = [w1, w1, w2, w3, unlockedIds[0]];
        reviewPool.forEach(sId => questions.push(gen.generateByStrategy(sId)));

        // 2. 10 ejercicios principales del Mundo Actual
        for (let i = 0; i < 10; i++) {
            questions.push(gen.generateByStrategy(currentWorld));
        }

        // 3. 3 ejercicios de transferencia (combinando las estrategias más débiles)
        [w1, w2, currentWorld].forEach(sId => questions.push(gen.generateByStrategy(sId)));

        // 4. 2 ejercicios sencillos de cierre
        questions.push(gen.generateByStrategy(1));
        questions.push(gen.generateByStrategy(currentWorld));

        return questions;
    }

    function shouldTriggerPreventiveHelp(sessionHistory, currentStrategyId) {
        if (sessionHistory.length < 2) return false;

        // Condición 1: 2 errores seguidos en la misma estrategia
        const sameStrategy = sessionHistory.filter(h => h.strategyId === currentStrategyId);
        if (sameStrategy.length >= 2) {
            const lastTwo = sameStrategy.slice(-2);
            if (!lastTwo[0].correct && !lastTwo[1].correct) return true;
        }

        // Condición 2: 3 errores en los últimos 5 ejercicios
        const lastFive = sessionHistory.slice(-5);
        const errorsInFive = lastFive.filter(h => !h.correct).length;
        return errorsInFive >= 3;
    }

    function registerAnswer(student, question, isCorrect) {
        const sId = question.strategyId;
        const currentScore = student.dominio[sId] || 50;
        const delta = isCorrect ? 4 : -6;
        student.dominio[sId] = Math.max(0, Math.min(100, currentScore + delta));
        student.contadores[sId] = (student.contadores[sId] || 0) + 1;

        // Evaluar desbloqueo del siguiente mundo (20 ejercicios + >=80% dominio)
        const world = student.mundoActual;
        if (
            world < 8 &&
            (student.contadores[world] || 0) >= 20 &&
            (student.dominio[world] || 0) >= 80
        ) {
            student.mundoActual = world + 1;
            if ((student.dominio[student.mundoActual] || 0) === 0) {
                student.dominio[student.mundoActual] = 50;
            }
        }

        // Evaluar logros pedagógicos
        ACHIEVEMENTS.forEach(ach => {
            if ((student.dominio[ach.strategyId] || 0) >= 80 && !student.logros.includes(ach.id)) {
                student.logros.push(ach.id);
            }
        });
    }

    window.DragonApp.Adaptive = {
        ACHIEVEMENTS,
        getMasteryLabel,
        buildSessionQuestions,
        shouldTriggerPreventiveHelp,
        registerAnswer
    };
})();
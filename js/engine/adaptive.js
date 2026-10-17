import { STRATEGY_ORDER, generateExercise, strategyByWorldIndex } from "./generator.js";

function masteryFromStats(stats) {
  const result = {};
  STRATEGY_ORDER.forEach((strategy) => {
    const item = stats[strategy];
    const mastery = !item || item.total === 0 ? 0 : Math.round((item.correct / item.total) * 100);
    result[strategy] = mastery;
  });
  return result;
}

function weakestStrategies(student, exclude = []) {
  const mastery = masteryFromStats(student.strategyStats);
  return [...STRATEGY_ORDER]
    .filter((s) => !exclude.includes(s))
    .sort((a, b) => mastery[a] - mastery[b]);
}

function weightedAdaptiveStrategy(student, fallback) {
  const weakest = weakestStrategies(student);
  const first = weakest[0] ?? fallback;
  const second = weakest[1] ?? fallback;
  const third = weakest[2] ?? fallback;

  const roll = Math.random();
  if (roll < 0.4) {
    return first;
  }
  if (roll < 0.7) {
    return second;
  }
  if (roll < 0.9) {
    return third;
  }
  return fallback;
}

function previousStrategies(worldIndex) {
  if (worldIndex <= 0) {
    return [strategyByWorldIndex(0)];
  }
  return STRATEGY_ORDER.slice(0, worldIndex);
}

function transferStrategies(worldIndex) {
  const base = strategyByWorldIndex(worldIndex);
  const next = strategyByWorldIndex(Math.min(STRATEGY_ORDER.length - 1, worldIndex + 1));
  const prev = strategyByWorldIndex(Math.max(0, worldIndex - 1));
  return [base, next, prev];
}

export function buildSession(student) {
  const worldIndex = Math.max(0, Math.min(STRATEGY_ORDER.length - 1, student.mundoActual || 0));
  const mainStrategy = strategyByWorldIndex(worldIndex);

  const session = [];

  const reviewPool = previousStrategies(worldIndex);
  for (let i = 0; i < 5; i += 1) {
    const strategy = reviewPool[Math.floor(Math.random() * reviewPool.length)] ?? mainStrategy;
    session.push(generateExercise(strategy));
  }

  for (let i = 0; i < 10; i += 1) {
    const strategy = weightedAdaptiveStrategy(student, mainStrategy);
    session.push(generateExercise(strategy));
  }

  const transferPool = transferStrategies(worldIndex);
  for (let i = 0; i < 3; i += 1) {
    const strategy = transferPool[i % transferPool.length];
    session.push(generateExercise(strategy));
  }

  const easyPool = ["amigos10", "dobles", "amigos100"];
  for (let i = 0; i < 2; i += 1) {
    const strategy = easyPool[Math.floor(Math.random() * easyPool.length)];
    session.push(generateExercise(strategy));
  }

  return session.slice(0, 20).map((item, index) => ({ ...item, index }));
}

export function shouldShowPreventiveHelp(sessionAnswers, nextStrategy) {
  if (!sessionAnswers.length) {
    return false;
  }

  const lastTwoSameStrategyErrors = sessionAnswers.slice(-2).every(
    (entry) => entry.strategy === nextStrategy && entry.correct === false
  );

  const lastFive = sessionAnswers.slice(-5);
  const errorsInLastFive = lastFive.filter((entry) => !entry.correct).length;

  return lastTwoSameStrategyErrors || errorsInLastFive >= 3;
}

export function updateWorldUnlock(student) {
  const current = strategyByWorldIndex(student.mundoActual || 0);
  const stats = student.strategyStats[current];
  if (!stats || stats.total < 20) {
    return student;
  }

  const mastery = stats.total === 0 ? 0 : (stats.correct / stats.total) * 100;
  if (mastery >= 80 && student.mundoActual < STRATEGY_ORDER.length - 1) {
    return {
      ...student,
      mundoActual: student.mundoActual + 1
    };
  }

  return student;
}

export function masteryLabel(value) {
  if (value <= 59) {
    return "Necesita ayuda";
  }
  if (value <= 79) {
    return "En desarrollo";
  }
  if (value <= 94) {
    return "Competente";
  }
  return "Dominio";
}

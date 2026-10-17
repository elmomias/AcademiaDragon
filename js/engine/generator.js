export const STRATEGY_ORDER = [
  "amigos10",
  "amigos100",
  "decena",
  "resta",
  "dobles",
  "casiDobles",
  "masMenos9",
  "masMenos11"
];

export const STRATEGY_LABELS = {
  amigos10: "Amigos del 10",
  amigos100: "Amigos del 100",
  decena: "Llegar a la decena",
  resta: "Restas inteligentes",
  dobles: "Dobles",
  casiDobles: "Casi dobles",
  masMenos9: "+9 y -9",
  masMenos11: "+11 y -11"
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(items) {
  return items[randInt(0, items.length - 1)];
}

function generateAmigos10() {
  const a = randInt(1, 9);
  const b = 10 - a;
  const mode = Math.random() < 0.5 ? "hueco" : "suma";

  if (mode === "hueco") {
    return {
      enunciado: `${a} + ? = 10`,
      respuesta: b,
      paso1: `${a} + ${b} = 10`,
      paso2: `Entonces ? = ${b}`
    };
  }

  return {
    enunciado: `${a} + ${b} = ?`,
    respuesta: 10,
    paso1: `${a} + ${b} = 10`,
    paso2: "La respuesta es 10"
  };
}

function generateAmigos100() {
  const mode = Math.random() < 0.5 ? "decenas" : "dosCifras";
  let a = 0;
  if (mode === "decenas") {
    a = randInt(1, 9) * 10;
  } else {
    a = randInt(11, 89);
    if (a % 10 === 0) {
      a += 1;
    }
  }
  const b = 100 - a;

  return {
    enunciado: `${a} + ${b} = ?`,
    respuesta: 100,
    paso1: `${a} + ${b} = 100`,
    paso2: "La respuesta es 100"
  };
}

function generateLlegarDecena() {
  const decenaBase = randInt(2, 8) * 10;
  const unidad = randInt(1, 8);
  const a = decenaBase + unidad;
  const salto = 10 - unidad;
  const resto = randInt(1, 4);
  const b = salto + resto;
  const intermedio = a + salto;
  const respuesta = intermedio + resto;

  return {
    enunciado: `${a} + ${b} = ?`,
    respuesta,
    paso1: `${a} + ${salto} = ${intermedio}`,
    paso2: `${intermedio} + ${resto} = ${respuesta}`
  };
}

function generateRestasInteligentes() {
  const decenaBase = randInt(3, 9) * 10;
  const unidad = randInt(2, 9);
  const a = decenaBase + unidad;
  const salto = unidad;
  const resto = randInt(1, Math.min(5, decenaBase / 10));
  const b = salto + resto;
  const intermedio = a - salto;
  const respuesta = intermedio - resto;

  return {
    enunciado: `${a} - ${b} = ?`,
    respuesta,
    paso1: `${a} - ${salto} = ${intermedio}`,
    paso2: `${intermedio} - ${resto} = ${respuesta}`
  };
}

function generateDobles() {
  const base = choice([2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 15, 18, 20, 25, 30, 35, 40, 45]);
  const respuesta = base * 2;
  return {
    enunciado: `${base} + ${base} = ?`,
    respuesta,
    paso1: `Doblar ${base} es ${respuesta}`,
    paso2: `La respuesta es ${respuesta}`
  };
}

function generateCasiDobles() {
  const a = randInt(4, 40);
  const b = a + 1;
  const doble = a * 2;
  const respuesta = doble + 1;

  return {
    enunciado: `${a} + ${b} = ?`,
    respuesta,
    paso1: `${a} + ${a} = ${doble}`,
    paso2: `${doble} + 1 = ${respuesta}`
  };
}

function generateMasMenos9() {
  const isAdd = Math.random() < 0.5;
  if (isAdd) {
    const a = randInt(12, 89);
    const pasoA = a + 10;
    const respuesta = pasoA - 1;
    return {
      enunciado: `${a} + 9 = ?`,
      respuesta,
      paso1: `${a} + 10 = ${pasoA}`,
      paso2: `${pasoA} - 1 = ${respuesta}`
    };
  }

  const a = randInt(19, 99);
  const pasoA = a - 10;
  const respuesta = pasoA + 1;
  return {
    enunciado: `${a} - 9 = ?`,
    respuesta,
    paso1: `${a} - 10 = ${pasoA}`,
    paso2: `${pasoA} + 1 = ${respuesta}`
  };
}

function generateMasMenos11() {
  const isAdd = Math.random() < 0.5;
  if (isAdd) {
    const a = randInt(12, 88);
    const pasoA = a + 10;
    const respuesta = pasoA + 1;
    return {
      enunciado: `${a} + 11 = ?`,
      respuesta,
      paso1: `${a} + 10 = ${pasoA}`,
      paso2: `${pasoA} + 1 = ${respuesta}`
    };
  }

  const a = randInt(22, 99);
  const pasoA = a - 10;
  const respuesta = pasoA - 1;
  return {
    enunciado: `${a} - 11 = ?`,
    respuesta,
    paso1: `${a} - 10 = ${pasoA}`,
    paso2: `${pasoA} - 1 = ${respuesta}`
  };
}

const GENERATORS = {
  amigos10: generateAmigos10,
  amigos100: generateAmigos100,
  decena: generateLlegarDecena,
  resta: generateRestasInteligentes,
  dobles: generateDobles,
  casiDobles: generateCasiDobles,
  masMenos9: generateMasMenos9,
  masMenos11: generateMasMenos11
};

export function generateExercise(strategy) {
  const generator = GENERATORS[strategy] ?? generateAmigos10;
  const exercise = generator();
  return {
    ...exercise,
    strategy
  };
}

export function strategyByWorldIndex(worldIndex) {
  const index = Math.max(0, Math.min(STRATEGY_ORDER.length - 1, worldIndex));
  return STRATEGY_ORDER[index];
}

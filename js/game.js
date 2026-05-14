let player = {
  health: 100,
  magic: 50,
  bond: 20,
  inventory: [],
  log: []
};

let currentScene = "start";

const titleEl = document.getElementById("scene-title");
const textEl = document.getElementById("scene-text");
const choicesEl = document.getElementById("choices");

const healthBar = document.getElementById("health-bar");
const magicBar = document.getElementById("magic-bar");
const bondBar = document.getElementById("bond-bar");

const healthText = document.getElementById("health-text");
const magicText = document.getElementById("magic-text");
const bondText = document.getElementById("bond-text");

const inventoryEl = document.getElementById("inventory");
const logEl = document.getElementById("log");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function applyEffect(effect = {}) {
  if (effect.health) {
    player.health += effect.health;
  }

  if (effect.magic) {
    player.magic += effect.magic;
  }

  if (effect.bond) {
    player.bond += effect.bond;
  }

  player.health = clamp(player.health, 0, 100);
  player.magic = clamp(player.magic, 0, 100);
  player.bond = clamp(player.bond, 0, 100);

  if (effect.addItem && !player.inventory.includes(effect.addItem)) {
    player.inventory.push(effect.addItem);
  }

  if (effect.removeItem) {
    player.inventory = player.inventory.filter(item => item !== effect.removeItem);
  }

  if (effect.log) {
    player.log.unshift(effect.log);
  }
}

function updateStats() {
  healthBar.style.width = player.health + "%";
  magicBar.style.width = player.magic + "%";
  bondBar.style.width = player.bond + "%";

  healthText.textContent = player.health + "/100";
  magicText.textContent = player.magic + "/100";
  bondText.textContent = player.bond + "/100";

  inventoryEl.innerHTML = "";
  if (player.inventory.length === 0) {
    inventoryEl.innerHTML = "<li>Niets</li>";
  } else {
    player.inventory.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      inventoryEl.appendChild(li);
    });
  }

  logEl.innerHTML = "";
  if (player.log.length === 0) {
    logEl.innerHTML = "<li>Je avontuur is net begonnen.</li>";
  } else {
    player.log.slice(0, 6).forEach(entry => {
      const li = document.createElement("li");
      li.textContent = entry;
      logEl.appendChild(li);
    });
  }
}

function renderScene() {
  if (player.health <= 0) {
    renderGameOver();
    return;
  }

  const scene = scenes[currentScene];

  titleEl.textContent = scene.title;
  textEl.textContent = scene.text;
  choicesEl.innerHTML = "";

  if (scene.ending) {
    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Speel opnieuw";
    restartBtn.className = "choice-btn";
    restartBtn.onclick = restartGame;
    choicesEl.appendChild(restartBtn);

    updateStats();
    return;
  }

  scene.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.className = "choice-btn";

    if (choice.className) {
      button.classList.add(choice.className);
    }

    button.onclick = () => {
      applyEffect(choice.effect);
      currentScene = choice.next;
      renderScene();
    };

    choicesEl.appendChild(button);
  });

  updateStats();
}

function renderGameOver() {
  titleEl.textContent = "Je bent gevallen";
  textEl.textContent = `Je avontuur eindigt hier.

Misschien gebruikte je te veel magie, vocht je te roekeloos of vergat je dat zelfs een Drakenrijder grenzen heeft.

Maar verhalen kunnen opnieuw beginnen.`;

  choicesEl.innerHTML = "";

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Opnieuw beginnen";
  restartBtn.className = "choice-btn danger";
  restartBtn.onclick = restartGame;

  choicesEl.appendChild(restartBtn);
  updateStats();
}

function restartGame() {
  player = {
    health: 100,
    magic: 50,
    bond: 20,
    inventory: [],
    log: []
  };

  currentScene = "start";
  renderScene();
}

renderScene();
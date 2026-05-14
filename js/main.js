const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

scene.clearColor = new BABYLON.Color4(0.55, 0.8, 1, 1);

const light = new BABYLON.HemisphericLight(
  "light",
  new BABYLON.Vector3(0, 1, 0),
  scene
);
light.intensity = 0.9;

const ground = BABYLON.MeshBuilder.CreateGround(
  "ground",
  { width: 200, height: 200 },
  scene
);

const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
groundMat.diffuseColor = new BABYLON.Color3(0.25, 0.6, 0.25);
ground.material = groundMat;

// Materialen
function makeMat(name, r, g, b) {
  const mat = new BABYLON.StandardMaterial(name, scene);
  mat.diffuseColor = new BABYLON.Color3(r, g, b);
  return mat;
}

const playerMat = makeMat("playerMat", 0.1, 0.25, 0.9);
const skinMat = makeMat("skinMat", 0.8, 0.55, 0.35);
const bromMat = makeMat("bromMat", 0.35, 0.18, 0.08);
const dragonMat = makeMat("dragonMat", 0.05, 0.35, 1);
const enemyMat = makeMat("enemyMat", 0.7, 0.05, 0.05);
const houseMat = makeMat("houseMat", 0.55, 0.35, 0.18);

// Speler
const player = new BABYLON.TransformNode("player", scene);
player.position = new BABYLON.Vector3(0, 0, 10);

const playerBody = BABYLON.MeshBuilder.CreateBox(
  "playerBody",
  { width: 1.2, height: 2.2, depth: 0.8 },
  scene
);
playerBody.parent = player;
playerBody.position.y = 1.1;
playerBody.material = playerMat;

const playerHead = BABYLON.MeshBuilder.CreateSphere(
  "playerHead",
  { diameter: 0.8 },
  scene
);
playerHead.parent = player;
playerHead.position.y = 2.6;
playerHead.material = skinMat;

// Brom
const brom = new BABYLON.TransformNode("brom", scene);
brom.position = new BABYLON.Vector3(5, 0, 5);

const bromBody = BABYLON.MeshBuilder.CreateCylinder(
  "bromBody",
  { diameterTop: 1, diameterBottom: 1.4, height: 2.5 },
  scene
);
bromBody.parent = brom;
bromBody.position.y = 1.25;
bromBody.material = bromMat;

const bromHead = BABYLON.MeshBuilder.CreateSphere(
  "bromHead",
  { diameter: 0.75 },
  scene
);
bromHead.parent = brom;
bromHead.position.y = 2.8;
bromHead.material = skinMat;

// Draak
const dragon = new BABYLON.TransformNode("dragon", scene);
dragon.position = new BABYLON.Vector3(-8, 4, 6);

const dragonBody = BABYLON.MeshBuilder.CreateSphere(
  "dragonBody",
  { diameterX: 4, diameterY: 2, diameterZ: 6 },
  scene
);
dragonBody.parent = dragon;
dragonBody.material = dragonMat;

const dragonHead = BABYLON.MeshBuilder.CreateSphere(
  "dragonHead",
  { diameter: 1.6 },
  scene
);
dragonHead.parent = dragon;
dragonHead.position.z = 3.6;
dragonHead.position.y = 0.5;
dragonHead.material = dragonMat;

const leftWing = BABYLON.MeshBuilder.CreateBox(
  "leftWing",
  { width: 7, height: 0.15, depth: 3 },
  scene
);
leftWing.parent = dragon;
leftWing.position.x = -4;
leftWing.material = dragonMat;

const rightWing = BABYLON.MeshBuilder.CreateBox(
  "rightWing",
  { width: 7, height: 0.15, depth: 3 },
  scene
);
rightWing.parent = dragon;
rightWing.position.x = 4;
rightWing.material = dragonMat;

// Huizen
for (let i = 0; i < 5; i++) {
  const house = BABYLON.MeshBuilder.CreateBox(
    "house" + i,
    { width: 6, height: 5, depth: 6 },
    scene
  );

  house.position = new BABYLON.Vector3(-20 + i * 10, 2.5, -10);
  house.material = houseMat;
}

// Vijanden
const enemies = [];

for (let i = 0; i < 5; i++) {
  const enemy = BABYLON.MeshBuilder.CreateBox(
    "enemy" + i,
    { width: 1.2, height: 2.2, depth: 0.8 },
    scene
  );

  enemy.position = new BABYLON.Vector3(30 + i * 4, 1.1, -20);
  enemy.material = enemyMat;
  enemy.hp = 100;
  enemies.push(enemy);
}

// Camera
const camera = new BABYLON.FollowCamera(
  "camera",
  new BABYLON.Vector3(0, 8, -16),
  scene
);

camera.lockedTarget = player;
camera.radius = 18;
camera.heightOffset = 8;
camera.rotationOffset = 180;
camera.cameraAcceleration = 0.08;
camera.maxCameraSpeed = 20;
camera.attachControl(canvas, true);

// Input
const keys = {};
let mounted = false;
let questStarted = false;
let enemiesDefeated = 0;

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.key.toLowerCase() === "e") {
    interact();
  }

  if (e.key.toLowerCase() === "f") {
    swordAttack();
  }

  if (e.key.toLowerCase() === "r") {
    magicAttack();
  }

  if (e.key.toLowerCase() === "q") {
    showMessage("Saphira komt dichterbij!");
    dragon.position = player.position.add(new BABYLON.Vector3(-5, 4, -5));
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function showMessage(text) {
  const box = document.getElementById("messageBox");
  if (!box) {
    alert(text);
    return;
  }

  box.textContent = text;
  box.classList.remove("hidden");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 2500);
}

function interact() {
  const distanceToBrom = BABYLON.Vector3.Distance(player.position, brom.position);
  const distanceToDragon = BABYLON.Vector3.Distance(player.position, dragon.position);

  if (distanceToBrom < 5 && !mounted) {
    questStarted = true;
    showMessage("Brom: Goed. Versla de 5 schaduwjagers in het kamp!");
    const questText = document.getElementById("questText");
    if (questText) questText.textContent = "Versla 5 schaduwjagers.";
    return;
  }

  if (distanceToDragon < 7) {
    mounted = !mounted;

    if (mounted) {
      showMessage("Je zit nu op Saphira!");
      camera.lockedTarget = dragon;
      playerBody.setEnabled(false);
      playerHead.setEnabled(false);
    } else {
      showMessage("Je stapt van Saphira.");
      camera.lockedTarget = player;
      player.position = dragon.position.add(new BABYLON.Vector3(2, -3, 2));
      player.position.y = 0;
      playerBody.setEnabled(true);
      playerHead.setEnabled(true);
    }

    return;
  }

  showMessage("Er is hier niets om mee te praten.");
}

function swordAttack() {
  if (mounted) {
    showMessage("Je kan geen zwaard gebruiken op de draak. Gebruik R voor drakenvuur!");
    return;
  }

  for (const enemy of enemies) {
    if (!enemy.isEnabled()) continue;

    const d = BABYLON.Vector3.Distance(player.position, enemy.position);

    if (d < 4) {
      enemy.hp -= 50;
      showMessage("Raak met zwaard!");

      if (enemy.hp <= 0) {
        enemy.setEnabled(false);
        enemiesDefeated++;
        updateQuest();
      }

      return;
    }
  }

  showMessage("Je slaat in de lucht.");
}

function magicAttack() {
  const origin = mounted ? dragon.position.clone() : player.position.clone();
  origin.y += mounted ? 0 : 1.5;

  const forward = new BABYLON.Vector3(
    Math.sin((mounted ? dragon.rotation.y : player.rotation.y)),
    0,
    Math.cos((mounted ? dragon.rotation.y : player.rotation.y))
  );

  const fireball = BABYLON.MeshBuilder.CreateSphere(
    "fireball",
    { diameter: mounted ? 1.5 : 0.8 },
    scene
  );

  fireball.position = origin.add(forward.scale(3));

  const fireMat = new BABYLON.StandardMaterial("fireMat" + Math.random(), scene);
  fireMat.emissiveColor = mounted
    ? new BABYLON.Color3(1, 0.25, 0)
    : new BABYLON.Color3(0.5, 0.3, 1);

  fireball.material = fireMat;

  const damage = mounted ? 100 : 40;
  let life = 2;

  const observer = scene.onBeforeRenderObservable.add(() => {
    const dt = engine.getDeltaTime() / 1000;
    life -= dt;

    fireball.position.addInPlace(forward.scale(35 * dt));

    for (const enemy of enemies) {
      if (!enemy.isEnabled()) continue;

      const d = BABYLON.Vector3.Distance(fireball.position, enemy.position);

      if (d < 2.5) {
        enemy.hp -= damage;
        fireball.dispose();
        scene.onBeforeRenderObservable.remove(observer);

        if (enemy.hp <= 0) {
          enemy.setEnabled(false);
          enemiesDefeated++;
          updateQuest();
        }

        return;
      }
    }

    if (life <= 0) {
      fireball.dispose();
      scene.onBeforeRenderObservable.remove(observer);
    }
  });

  showMessage(mounted ? "Drakenvuur!" : "Magische kogel!");
}

function updateQuest() {
  const questText = document.getElementById("questText");

  if (enemiesDefeated >= 5) {
    showMessage("Alle vijanden verslagen! Keer terug naar Brom.");
    if (questText) questText.textContent = "Keer terug naar Brom.";
  } else {
    if (questText) questText.textContent = `Versla 5 schaduwjagers. ${enemiesDefeated}/5`;
  }
}

function updateMovement() {
  const target = mounted ? dragon : player;

  let speed = keys["shift"] ? 0.35 : 0.2;

  if (mounted) speed = keys["shift"] ? 0.65 : 0.4;

  const forward = new BABYLON.Vector3(
    Math.sin(target.rotation.y),
    0,
    Math.cos(target.rotation.y)
  );

  const right = new BABYLON.Vector3(forward.z, 0, -forward.x);

  if (keys["w"]) target.position.addInPlace(forward.scale(speed));
  if (keys["s"]) target.position.subtractInPlace(forward.scale(speed));
  if (keys["a"]) target.rotation.y -= 0.04;
  if (keys["d"]) target.rotation.y += 0.04;

  if (mounted) {
    if (keys[" "]) target.position.y += 0.25;
    if (keys["c"]) target.position.y -= 0.25;

    if (target.position.y < 3) target.position.y = 3;
    if (target.position.y > 45) target.position.y = 45;

    player.position = dragon.position.clone();
  }
}

function animateDragon() {
  const t = performance.now() * 0.006;
  leftWing.rotation.z = Math.sin(t) * 0.5;
  rightWing.rotation.z = -Math.sin(t) * 0.5;

  if (!mounted) {
    dragon.position.y = 4 + Math.sin(t * 0.5) * 0.5;
  }
}

engine.runRenderLoop(() => {
  updateMovement();
  animateDragon();
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

showMessage("3D-game geladen! Loop naar Brom en druk op E.");
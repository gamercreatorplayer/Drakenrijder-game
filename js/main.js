// Drakenrijder 3D - realistische GLB-versie
// Deze versie probeert echte 3D-modellen te laden uit de map assets/
// Bestanden:
// assets/player.glb
// assets/dragon.glb
// assets/brom.glb
// assets/enemy.glb
// assets/village.glb

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

const scene = new BABYLON.Scene(engine);

// Mooier beeld
scene.clearColor = new BABYLON.Color4(0.52, 0.72, 0.95, 1);
scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
scene.fogDensity = 0.012;
scene.fogColor = new BABYLON.Color3(0.55, 0.68, 0.85);

// Licht
const hemi = new BABYLON.HemisphericLight(
  "hemi",
  new BABYLON.Vector3(0, 1, 0),
  scene
);
hemi.intensity = 0.55;

const sun = new BABYLON.DirectionalLight(
  "sun",
  new BABYLON.Vector3(-0.5, -1.5, -0.7),
  scene
);
sun.position = new BABYLON.Vector3(60, 90, 60);
sun.intensity = 1.4;

// Schaduwen
const shadowGenerator = new BABYLON.ShadowGenerator(2048, sun);
shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.blurKernel = 32;

// Camera
let cameraTarget = null;

const camera = new BABYLON.ArcRotateCamera(
  "camera",
  Math.PI,
  1.15,
  12,
  new BABYLON.Vector3(0, 2, 0),
  scene
);

camera.attachControl(canvas, true);
camera.lowerRadiusLimit = 5;
camera.upperRadiusLimit = 28;
camera.wheelDeltaPercentage = 0.01;
camera.panningSensibility = 0;

// Game state
const state = {
  health: 100,
  mana: 100,
  bond: 100,
  mounted: false,
  questStarted: false,
  questCompleted: false,
  enemiesDefeated: 0,
  totalEnemies: 5,
  canRideDragon: false
};

const keys = {};
const enemies = [];
const projectiles = [];

let playerRoot;
let playerModel;
let dragonRoot;
let dragonModel;
let bromRoot;
let bromModel;
let villageRoot;

let playerYaw = 0;
let dragonYaw = 0;

let messageTimer = null;

// UI
function updateUI() {
  setBar("healthFill", state.health);
  setBar("manaFill", state.mana);
  setBar("bondFill", state.bond);

  setText("healthText", `${Math.round(state.health)} / 100`);
  setText("manaText", `${Math.round(state.mana)} / 100`);
  setText("bondText", `${Math.round(state.bond)} / 100`);

  if (!state.questStarted) {
    setText("questText", "Praat met Brom.");
  } else if (state.questStarted && !state.questCompleted) {
    setText(
      "questText",
      `Versla de Schaduwjagers. ${state.enemiesDefeated}/${state.totalEnemies}`
    );
  } else {
    setText("questText", "Keer terug naar Brom. Training voltooid!");
  }
}

function setBar(id, value) {
  const el = document.getElementById(id);
  if (el) el.style.width = `${Math.max(0, Math.min(100, value))}%`;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showMessage(text, duration = 2600) {
  const box = document.getElementById("messageBox");

  if (!box) {
    alert(text);
    return;
  }

  box.textContent = text;
  box.classList.remove("hidden");

  if (messageTimer) clearTimeout(messageTimer);

  messageTimer = setTimeout(() => {
    box.classList.add("hidden");
  }, duration);
}

// Materials
function mat(name, r, g, b, rough = 0.7) {
  const m = new BABYLON.StandardMaterial(name, scene);
  m.diffuseColor = new BABYLON.Color3(r, g, b);
  m.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  return m;
}

const groundMat = mat("groundMat", 0.24, 0.48, 0.22);
const roadMat = mat("roadMat", 0.42, 0.34, 0.24);
const stoneMat = mat("stoneMat", 0.36, 0.37, 0.4);
const woodMat = mat("woodMat", 0.43, 0.25, 0.12);
const redMat = mat("enemyRed", 0.55, 0.05, 0.05);
const blueMat = mat("dragonBlue", 0.04, 0.32, 0.85);
const skinMat = mat("skin", 0.78, 0.55, 0.37);
const robeMat = mat("robe", 0.26, 0.13, 0.07);
const leatherMat = mat("leather", 0.22, 0.11, 0.05);
const metalMat = mat("metal", 0.75, 0.76, 0.78);

// Wereld maken
createTerrain();
createRoad();
createForest();
createMountains();
createLake();

// Roots
playerRoot = new BABYLON.TransformNode("playerRoot", scene);
playerRoot.position = new BABYLON.Vector3(0, 0, 12);

dragonRoot = new BABYLON.TransformNode("dragonRoot", scene);
dragonRoot.position = new BABYLON.Vector3(-8, 1.5, 8);

bromRoot = new BABYLON.TransformNode("bromRoot", scene);
bromRoot.position = new BABYLON.Vector3(5, 0, 5);

villageRoot = new BABYLON.TransformNode("villageRoot", scene);
villageRoot.position = new BABYLON.Vector3(0, 0, -8);

// Modellen laden
await loadVillage();
await loadPlayer();
await loadDragon();
await loadBrom();
await createEnemies();

cameraTarget = playerRoot;
showMessage("Realistische 3D-versie geladen. Loop naar Brom en druk E.");

// Input
window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.key.toLowerCase() === "e") interact();
  if (e.key.toLowerCase() === "f") swordAttack();
  if (e.key.toLowerCase() === "r") magicAttack();
  if (e.key.toLowerCase() === "q") callDragon();
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Assets laden met fallback
async function tryLoadGLB(fileName, parent, scale = 1) {
  try {
    const result = await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "assets/",
      fileName,
      scene
    );

    const root = new BABYLON.TransformNode(fileName + "_root", scene);

    result.meshes.forEach((mesh) => {
      if (mesh.name !== "__root__") {
        mesh.parent = root;
        mesh.receiveShadows = true;
        shadowGenerator.addShadowCaster(mesh, true);
      }
    });

    root.parent = parent;
    root.scaling = new BABYLON.Vector3(scale, scale, scale);

    return root;
  } catch (err) {
    console.warn(`Kon ${fileName} niet laden. Fallback wordt gebruikt.`, err);
    return null;
  }
}

async function loadPlayer() {
  const loaded = await tryLoadGLB("player.glb", playerRoot, 1);

  if (loaded) {
    playerModel = loaded;
    playerModel.rotation.y = Math.PI;
    return;
  }

  playerModel = createFallbackPlayer(playerRoot);
}

async function loadDragon() {
  const loaded = await tryLoadGLB("dragon.glb", dragonRoot, 1.8);

  if (loaded) {
    dragonModel = loaded;
    return;
  }

  dragonModel = createFallbackDragon(dragonRoot);
}

async function loadBrom() {
  const loaded = await tryLoadGLB("brom.glb", bromRoot, 1);

  if (loaded) {
    bromModel = loaded;
    bromModel.rotation.y = Math.PI;
    return;
  }

  bromModel = createFallbackBrom(bromRoot);
}

async function loadVillage() {
  const loaded = await tryLoadGLB("village.glb", villageRoot, 1);

  if (loaded) {
    villageRoot = loaded;
    villageRoot.position = new BABYLON.Vector3(0, 0, -8);
    return;
  }

  createFallbackVillage(villageRoot);
}

// Fallback player met armen, benen, cape en zwaard
function createFallbackPlayer(parent) {
  const root = new BABYLON.TransformNode("fallbackPlayer", scene);
  root.parent = parent;

  const body = BABYLON.MeshBuilder.CreateBox(
    "playerBody",
    { width: 0.9, height: 1.6, depth: 0.5 },
    scene
  );
  body.parent = root;
  body.position.y = 1.45;
  body.material = leatherMat;

  const chest = BABYLON.MeshBuilder.CreateBox(
    "playerChest",
    { width: 1.05, height: 0.8, depth: 0.6 },
    scene
  );
  chest.parent = root;
  chest.position.y = 1.9;
  chest.material = mat("darkBlueCloth", 0.08, 0.15, 0.35);

  const head = BABYLON.MeshBuilder.CreateSphere(
    "playerHead",
    { diameter: 0.55 },
    scene
  );
  head.parent = root;
  head.position.y = 2.65;
  head.material = skinMat;

  const hair = BABYLON.MeshBuilder.CreateSphere(
    "playerHair",
    { diameter: 0.58 },
    scene
  );
  hair.parent = root;
  hair.position.y = 2.82;
  hair.scaling.y = 0.45;
  hair.material = mat("hair", 0.12, 0.07, 0.03);

  const leftArm = BABYLON.MeshBuilder.CreateCylinder(
    "leftArm",
    { diameter: 0.22, height: 1.15 },
    scene
  );
  leftArm.parent = root;
  leftArm.position = new BABYLON.Vector3(-0.72, 1.75, 0);
  leftArm.rotation.z = -0.18;
  leftArm.material = leatherMat;

  const rightArm = BABYLON.MeshBuilder.CreateCylinder(
    "rightArm",
    { diameter: 0.22, height: 1.15 },
    scene
  );
  rightArm.parent = root;
  rightArm.position = new BABYLON.Vector3(0.72, 1.75, 0);
  rightArm.rotation.z = 0.18;
  rightArm.material = leatherMat;

  const leftLeg = BABYLON.MeshBuilder.CreateCylinder(
    "leftLeg",
    { diameter: 0.26, height: 1.15 },
    scene
  );
  leftLeg.parent = root;
  leftLeg.position = new BABYLON.Vector3(-0.28, 0.65, 0);
  leftLeg.material = mat("pants", 0.08, 0.08, 0.1);

  const rightLeg = BABYLON.MeshBuilder.CreateCylinder(
    "rightLeg",
    { diameter: 0.26, height: 1.15 },
    scene
  );
  rightLeg.parent = root;
  rightLeg.position = new BABYLON.Vector3(0.28, 0.65, 0);
  rightLeg.material = mat("pants2", 0.08, 0.08, 0.1);

  const cape = BABYLON.MeshBuilder.CreateBox(
    "cape",
    { width: 1.0, height: 1.5, depth: 0.05 },
    scene
  );
  cape.parent = root;
  cape.position = new BABYLON.Vector3(0, 1.55, -0.35);
  cape.rotation.x = -0.16;
  cape.material = mat("capeRed", 0.35, 0.02, 0.04);

  const sword = BABYLON.MeshBuilder.CreateBox(
    "sword",
    { width: 0.08, height: 1.35, depth: 0.08 },
    scene
  );
  sword.parent = root;
  sword.position = new BABYLON.Vector3(0.85, 1.45, 0.12);
  sword.rotation.z = 0.55;
  sword.material = metalMat;

  [body, chest, head, hair, leftArm, rightArm, leftLeg, rightLeg, cape, sword].forEach((m) => {
    shadowGenerator.addShadowCaster(m);
  });

  return root;
}

function createFallbackDragon(parent) {
  const root = new BABYLON.TransformNode("fallbackDragon", scene);
  root.parent = parent;

  const body = BABYLON.MeshBuilder.CreateSphere(
    "dragonBody",
    { diameterX: 3.5, diameterY: 1.5, diameterZ: 5.2 },
    scene
  );
  body.parent = root;
  body.position.y = 1.2;
  body.material = blueMat;

  const head = BABYLON.MeshBuilder.CreateSphere(
    "dragonHead",
    { diameter: 1.25 },
    scene
  );
  head.parent = root;
  head.position = new BABYLON.Vector3(0, 1.55, 3.0);
  head.material = blueMat;

  const snout = BABYLON.MeshBuilder.CreateBox(
    "dragonSnout",
    { width: 0.8, height: 0.45, depth: 1.0 },
    scene
  );
  snout.parent = root;
  snout.position = new BABYLON.Vector3(0, 1.45, 3.75);
  snout.material = blueMat;

  const leftWing = BABYLON.MeshBuilder.CreateBox(
    "leftWing",
    { width: 4.8, height: 0.08, depth: 2.4 },
    scene
  );
  leftWing.parent = root;
  leftWing.position = new BABYLON.Vector3(-3.0, 1.45, 0);
  leftWing.rotation.z = 0.25;
  leftWing.material = mat("wingDark", 0.02, 0.08, 0.25);

  const rightWing = BABYLON.MeshBuilder.CreateBox(
    "rightWing",
    { width: 4.8, height: 0.08, depth: 2.4 },
    scene
  );
  rightWing.parent = root;
  rightWing.position = new BABYLON.Vector3(3.0, 1.45, 0);
  rightWing.rotation.z = -0.25;
  rightWing.material = mat("wingDark2", 0.02, 0.08, 0.25);

  const tail = BABYLON.MeshBuilder.CreateCylinder(
    "dragonTail",
    { diameterTop: 0.18, diameterBottom: 0.8, height: 4.5 },
    scene
  );
  tail.parent = root;
  tail.position = new BABYLON.Vector3(0, 1.0, -3.9);
  tail.rotation.x = Math.PI / 2;
  tail.material = blueMat;

  const saddle = BABYLON.MeshBuilder.CreateBox(
    "saddle",
    { width: 1.0, height: 0.22, depth: 1.1 },
    scene
  );
  saddle.parent = root;
  saddle.position = new BABYLON.Vector3(0, 2.05, 0.2);
  saddle.material = leatherMat;

  root.leftWing = leftWing;
  root.rightWing = rightWing;

  [body, head, snout, leftWing, rightWing, tail, saddle].forEach((m) => {
    shadowGenerator.addShadowCaster(m);
  });

  return root;
}

function createFallbackBrom(parent) {
  const root = new BABYLON.TransformNode("fallbackBrom", scene);
  root.parent = parent;

  const body = BABYLON.MeshBuilder.CreateCylinder(
    "bromBody",
    { diameterTop: 0.8, diameterBottom: 1.1, height: 2.2 },
    scene
  );
  body.parent = root;
  body.position.y = 1.15;
  body.material = robeMat;

  const head = BABYLON.MeshBuilder.CreateSphere(
    "bromHead",
    { diameter: 0.55 },
    scene
  );
  head.parent = root;
  head.position.y = 2.5;
  head.material = skinMat;

  const beard = BABYLON.MeshBuilder.CreateSphere(
    "bromBeard",
    { diameter: 0.45 },
    scene
  );
  beard.parent = root;
  beard.position = new BABYLON.Vector3(0, 2.25, 0.25);
  beard.scaling.y = 1.25;
  beard.material = mat("greyBeard", 0.75, 0.75, 0.72);

  const staff = BABYLON.MeshBuilder.CreateCylinder(
    "bromStaff",
    { diameter: 0.08, height: 2.8 },
    scene
  );
  staff.parent = root;
  staff.position = new BABYLON.Vector3(0.75, 1.35, 0);
  staff.rotation.z = 0.12;
  staff.material = woodMat;

  [body, head, beard, staff].forEach((m) => {
    shadowGenerator.addShadowCaster(m);
  });

  return root;
}

function createFallbackVillage(parent) {
  const positions = [
    [-12, 0, -4],
    [-5, 0, -14],
    [8, 0, -10],
    [16, 0, -2],
    [-17, 0, -18]
  ];

  positions.forEach((p, i) => {
    const house = new BABYLON.TransformNode("houseRoot" + i, scene);
    house.parent = parent;
    house.position = new BABYLON.Vector3(p[0], 0, p[2]);

    const base = BABYLON.MeshBuilder.CreateBox(
      "houseBase" + i,
      { width: 5.5, height: 3.6, depth: 5.5 },
      scene
    );
    base.parent = house;
    base.position.y = 1.8;
    base.material = woodMat;

    const roof = BABYLON.MeshBuilder.CreateCylinder(
      "houseRoof" + i,
      { diameterTop: 0, diameterBottom: 7.2, height: 2.4, tessellation: 4 },
      scene
    );
    roof.parent = house;
    roof.position.y = 4.6;
    roof.rotation.y = Math.PI / 4;
    roof.material = mat("roofMat" + i, 0.25, 0.08, 0.04);

    shadowGenerator.addShadowCaster(base);
    shadowGenerator.addShadowCaster(roof);
  });
}

// Vijanden
async function createEnemies() {
  const enemyPositions = [
    [42, 0, -24],
    [49, 0, -31],
    [56, 0, -23],
    [62, 0, -34],
    [69, 0, -28]
  ];

  for (let i = 0; i < enemyPositions.length; i++) {
    const root = new BABYLON.TransformNode("enemyRoot" + i, scene);
    root.position = new BABYLON.Vector3(
      enemyPositions[i][0],
      enemyPositions[i][1],
      enemyPositions[i][2]
    );

    const loaded = await tryLoadGLB("enemy.glb", root, 1);

    let visual;

    if (loaded) {
      visual = loaded;
    } else {
      visual = createFallbackEnemy(root, i);
    }

    enemies.push({
      root,
      visual,
      hp: 100,
      alive: true,
      attackCooldown: 0
    });
  }
}

function createFallbackEnemy(parent, i) {
  const root = new BABYLON.TransformNode("fallbackEnemy" + i, scene);
  root.parent = parent;

  const body = BABYLON.MeshBuilder.CreateBox(
    "enemyBody" + i,
    { width: 0.9, height: 1.8, depth: 0.55 },
    scene
  );
  body.parent = root;
  body.position.y = 1.25;
  body.material = redMat;

  const head = BABYLON.MeshBuilder.CreateSphere(
    "enemyHead" + i,
    { diameter: 0.55 },
    scene
  );
  head.parent = root;
  head.position.y = 2.35;
  head.material = mat("enemyBlack" + i, 0.03, 0.03, 0.035);

  const weapon = BABYLON.MeshBuilder.CreateBox(
    "enemyWeapon" + i,
    { width: 0.08, height: 1.4, depth: 0.08 },
    scene
  );
  weapon.parent = root;
  weapon.position = new BABYLON.Vector3(0.75, 1.35, 0.15);
  weapon.rotation.z = 0.45;
  weapon.material = metalMat;

  shadowGenerator.addShadowCaster(body);
  shadowGenerator.addShadowCaster(head);
  shadowGenerator.addShadowCaster(weapon);

  return root;
}

// Wereld
function createTerrain() {
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 220, height: 220, subdivisions: 48 },
    scene
  );

  ground.material = groundMat;
  ground.receiveShadows = true;
}

function createRoad() {
  const road = BABYLON.MeshBuilder.CreateGround(
    "road",
    { width: 8, height: 85 },
    scene
  );
  road.position = new BABYLON.Vector3(0, 0.02, -10);
  road.material = roadMat;
}

function createForest() {
  const leavesMat = mat("leaves", 0.08, 0.36, 0.12);

  for (let i = 0; i < 65; i++) {
    const x = -95 + Math.random() * 190;
    const z = -95 + Math.random() * 190;

    if (Math.abs(x) < 25 && Math.abs(z) < 25) continue;
    if (x > 35 && x < 80 && z > -45 && z < -10) continue;

    const trunk = BABYLON.MeshBuilder.CreateCylinder(
      "trunk" + i,
      { diameter: 0.7, height: 4.5 },
      scene
    );
    trunk.position = new BABYLON.Vector3(x, 2.25, z);
    trunk.material = woodMat;

    const leaves = BABYLON.MeshBuilder.CreateSphere(
      "treeLeaves" + i,
      { diameter: 4.5 },
      scene
    );
    leaves.position = new BABYLON.Vector3(x, 5.3, z);
    leaves.material = leavesMat;

    shadowGenerator.addShadowCaster(trunk);
    shadowGenerator.addShadowCaster(leaves);
  }
}

function createMountains() {
  const mountainPositions = [
    [-95, -95],
    [-65, -105],
    [-25, -108],
    [20, -110],
    [62, -105],
    [100, -88],
    [-110, 35],
    [108, 42]
  ];

  mountainPositions.forEach((p, i) => {
    const height = 22 + Math.random() * 22;
    const mountain = BABYLON.MeshBuilder.CreateCylinder(
      "mountain" + i,
      {
        diameterTop: 0,
        diameterBottom: 25 + Math.random() * 18,
        height,
        tessellation: 5
      },
      scene
    );

    mountain.position = new BABYLON.Vector3(p[0], height / 2, p[1]);
    mountain.rotation.y = Math.random() * Math.PI;
    mountain.material = stoneMat;

    shadowGenerator.addShadowCaster(mountain);
  });
}

function createLake() {
  const lakeMat = new BABYLON.StandardMaterial("lakeMat", scene);
  lakeMat.diffuseColor = new BABYLON.Color3(0.05, 0.35, 0.7);
  lakeMat.alpha = 0.6;

  const lake = BABYLON.MeshBuilder.CreateGround(
    "lake",
    { width: 28, height: 18 },
    scene
  );
  lake.position = new BABYLON.Vector3(-45, 0.04, 35);
  lake.rotation.y = 0.45;
  lake.material = lakeMat;
}

// Interactie
function interact() {
  if (!playerRoot || !dragonRoot || !bromRoot) return;

  const activeRoot = state.mounted ? dragonRoot : playerRoot;

  const bromDist = BABYLON.Vector3.Distance(activeRoot.position, bromRoot.position);
  const dragonDist = BABYLON.Vector3.Distance(playerRoot.position, dragonRoot.position);

  if (!state.mounted && bromDist < 5.5) {
    talkToBrom();
    return;
  }

  if (state.canRideDragon && dragonDist < 7.5) {
    toggleMount();
    return;
  }

  showMessage("Hier is niets om mee te praten.");
}

function talkToBrom() {
  if (!state.questStarted) {
    state.questStarted = true;
    state.canRideDragon = true;
    state.questCompleted = false;

    showMessage(
      "Brom: De draak heeft jou gekozen. Stap op Saphira en versla de Schaduwjagers."
    );

    return;
  }

  if (state.questStarted && !state.questCompleted) {
    showMessage("Brom: De Schaduwjagers zijn nog niet verslagen.");
    return;
  }

  if (state.questCompleted) {
    showMessage(
      "Brom: Goed gedaan. Je bent nog geen meester, maar je bent geen gewone jongen meer."
    );
  }
}

function callDragon() {
  if (!state.canRideDragon) {
    showMessage("Praat eerst met Brom.");
    return;
  }

  if (state.mounted) return;

  const target = playerRoot.position.add(new BABYLON.Vector3(-4, 1.5, -4));
  dragonRoot.position = BABYLON.Vector3.Lerp(dragonRoot.position, target, 0.8);
  showMessage("Saphira komt dichterbij.");
}

function toggleMount() {
  state.mounted = !state.mounted;

  if (state.mounted) {
    showMessage("Je zit nu op Saphira.");
    playerModel.setEnabled(false);
    dragonRoot.position.y = Math.max(dragonRoot.position.y, 3);
    cameraTarget = dragonRoot;
  } else {
    showMessage("Je stapt van Saphira.");
    playerModel.setEnabled(true);

    const forward = new BABYLON.Vector3(
      Math.sin(dragonYaw),
      0,
      Math.cos(dragonYaw)
    );

    playerRoot.position = dragonRoot.position.subtract(forward.scale(3));
    playerRoot.position.y = 0;
    cameraTarget = playerRoot;
  }
}

// Aanvallen
function swordAttack() {
  if (state.mounted) {
    showMessage("Op de draak gebruik je R voor drakenvuur.");
    return;
  }

  let hit = false;

  enemies.forEach((enemy) => {
    if (!enemy.alive) return;

    const d = BABYLON.Vector3.Distance(playerRoot.position, enemy.root.position);

    if (d < 4) {
      damageEnemy(enemy, 45);
      hit = true;
    }
  });

  showMessage(hit ? "Zwaardaanval raakt!" : "Je slaat in de lucht.");
}

function magicAttack() {
  if (state.mana < 18) {
    showMessage("Niet genoeg magie.");
    return;
  }

  state.mana -= state.mounted ? 28 : 18;

  const root = state.mounted ? dragonRoot : playerRoot;
  const yaw = state.mounted ? dragonYaw : playerYaw;

  const dir = new BABYLON.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const start = root.position.add(dir.scale(state.mounted ? 4 : 1.6));
  start.y += state.mounted ? 1.2 : 1.4;

  const ball = BABYLON.MeshBuilder.CreateSphere(
    "projectile",
    { diameter: state.mounted ? 1.4 : 0.75 },
    scene
  );

  ball.position = start;

  const m = new BABYLON.StandardMaterial("projectileMat" + Math.random(), scene);
  m.emissiveColor = state.mounted
    ? new BABYLON.Color3(1, 0.25, 0.02)
    : new BABYLON.Color3(0.55, 0.35, 1);
  ball.material = m;

  projectiles.push({
    mesh: ball,
    dir,
    life: 2.2,
    speed: state.mounted ? 45 : 34,
    damage: state.mounted ? 80 : 38
  });

  showMessage(state.mounted ? "Drakenvuur!" : "Magische kogel!");
}

function damageEnemy(enemy, damage) {
  enemy.hp -= damage;

  enemy.visual.scaling = new BABYLON.Vector3(1.15, 0.9, 1.15);
  setTimeout(() => {
    if (enemy.visual) enemy.visual.scaling = new BABYLON.Vector3(1, 1, 1);
  }, 120);

  if (enemy.hp <= 0) {
    enemy.alive = false;
    enemy.root.setEnabled(false);
    state.enemiesDefeated++;

    showMessage(`Schaduwjager verslagen! ${state.enemiesDefeated}/${state.totalEnemies}`);

    if (state.enemiesDefeated >= state.totalEnemies) {
      state.questCompleted = true;
      showMessage("Alle Schaduwjagers verslagen. Keer terug naar Brom!");
    }
  }
}

// Updates
function updateMovement(dt) {
  if (state.health <= 0) return;

  if (state.mounted) {
    moveDragon(dt);
  } else {
    movePlayer(dt);
  }
}

function movePlayer(dt) {
  let moving = false;
  const speed = keys["shift"] ? 9 : 5.5;

  if (keys["a"]) playerYaw -= 2.3 * dt;
  if (keys["d"]) playerYaw += 2.3 * dt;

  const forward = new BABYLON.Vector3(Math.sin(playerYaw), 0, Math.cos(playerYaw));

  if (keys["w"]) {
    playerRoot.position.addInPlace(forward.scale(speed * dt));
    moving = true;
  }

  if (keys["s"]) {
    playerRoot.position.subtractInPlace(forward.scale(speed * dt));
    moving = true;
  }

  playerRoot.rotation.y = playerYaw;

  if (moving && playerModel) {
    playerModel.position.y = Math.sin(performance.now() * 0.012) * 0.04;
  } else if (playerModel) {
    playerModel.position.y = 0;
  }
}

function moveDragon(dt) {
  const speed = keys["shift"] ? 22 : 13;

  if (keys["a"]) dragonYaw -= 1.8 * dt;
  if (keys["d"]) dragonYaw += 1.8 * dt;

  const forward = new BABYLON.Vector3(Math.sin(dragonYaw), 0, Math.cos(dragonYaw));

  if (keys["w"]) {
    dragonRoot.position.addInPlace(forward.scale(speed * dt));
  }

  if (keys["s"]) {
    dragonRoot.position.subtractInPlace(forward.scale(speed * dt));
  }

  if (keys[" "]) {
    dragonRoot.position.y += 10 * dt;
  }

  if (keys["c"]) {
    dragonRoot.position.y -= 10 * dt;
  }

  dragonRoot.position.y = Math.max(2.2, Math.min(45, dragonRoot.position.y));
  dragonRoot.rotation.y = dragonYaw;

  playerRoot.position = dragonRoot.position.clone();
}

function updateDragonIdle(dt) {
  if (!dragonModel) return;

  const t = performance.now() * 0.006;

  if (!state.mounted) {
    dragonRoot.position.y = 1.5 + Math.sin(t * 0.7) * 0.15;
  }

  if (dragonModel.leftWing && dragonModel.rightWing) {
    dragonModel.leftWing.rotation.z = 0.25 + Math.sin(t) * 0.35;
    dragonModel.rightWing.rotation.z = -0.25 - Math.sin(t) * 0.35;
  }
}

function updateEnemies(dt) {
  enemies.forEach((enemy) => {
    if (!enemy.alive || !state.questStarted) return;

    enemy.attackCooldown -= dt;

    const target = state.mounted ? dragonRoot : playerRoot;
    const d = BABYLON.Vector3.Distance(enemy.root.position, target.position);

    if (d < 30) {
      const dir = target.position.subtract(enemy.root.position);
      dir.y = 0;

      if (dir.length() > 0.01) {
        dir.normalize();
        enemy.root.position.addInPlace(dir.scale(3.3 * dt));
        enemy.root.rotation.y = Math.atan2(dir.x, dir.z);
      }

      if (d < 2.6 && enemy.attackCooldown <= 0) {
        enemy.attackCooldown = 1.25;
        state.health -= state.mounted ? 5 : 9;
        showMessage(state.mounted ? "Saphira wordt geraakt!" : "Je wordt geraakt!");
      }
    }
  });
}

function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    p.life -= dt;
    p.mesh.position.addInPlace(p.dir.scale(p.speed * dt));

    let remove = false;

    enemies.forEach((enemy) => {
      if (!enemy.alive || remove) return;

      const d = BABYLON.Vector3.Distance(p.mesh.position, enemy.root.position);

      if (d < 2.2) {
        damageEnemy(enemy, p.damage);
        remove = true;
      }
    });

    if (p.life <= 0) remove = true;

    if (remove) {
      p.mesh.dispose();
      projectiles.splice(i, 1);
    }
  }
}

function updateCamera() {
  if (!cameraTarget) return;

  const target = cameraTarget.position.add(new BABYLON.Vector3(0, state.mounted ? 2.5 : 1.8, 0));
  camera.target = BABYLON.Vector3.Lerp(camera.target, target, 0.12);

  camera.radius = BABYLON.Scalar.Lerp(camera.radius, state.mounted ? 18 : 10, 0.04);
  camera.beta = BABYLON.Scalar.Lerp(camera.beta, state.mounted ? 1.18 : 1.12, 0.04);
}

// Loop
let last = performance.now();

engine.runRenderLoop(() => {
  const now = performance.now();
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;

  state.mana = Math.min(100, state.mana + dt * 6);

  updateMovement(dt);
  updateDragonIdle(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateCamera();
  updateUI();

  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
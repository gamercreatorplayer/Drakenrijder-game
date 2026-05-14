export function createPlayer(scene, pos) {
  const root = new BABYLON.TransformNode("playerRoot", scene);
  root.position = pos.clone();

  const blue = mat(scene, "playerBlue", 0.18, 0.32, 0.82);
  const skin = mat(scene, "skin", 0.75, 0.55, 0.38);
  const leather = mat(scene, "leather", 0.36, 0.2, 0.1);
  const metal = mat(scene, "metal", 0.8, 0.82, 0.85);

  const body = box(scene, "playerBody", 1.1, 2.1, 0.75, blue, root, 0, 1.55, 0);
  sphere(scene, "playerHead", 0.82, skin, root, 0, 2.95, 0);

  box(scene, "leftArm", 0.28, 1.4, 0.28, leather, root, -0.85, 1.65, 0);
  box(scene, "rightArm", 0.28, 1.4, 0.28, leather, root, 0.85, 1.65, 0);

  box(scene, "leftLeg", 0.35, 1.25, 0.35, leather, root, -0.32, 0.55, 0);
  box(scene, "rightLeg", 0.35, 1.25, 0.35, leather, root, 0.32, 0.55, 0);

  const sword = box(scene, "sword", 0.15, 1.7, 0.18, metal, root, 1.05, 1.55, 0.2);
  sword.rotation.z = 0.35;

  return {
    root,
    body,
    speed: 9,
    sprintSpeed: 14,
    velocityY: 0,
    onGround: true,
    facing: new BABYLON.Vector3(0, 0, 1),
    swordCooldown: 0,
    magicCooldown: 0
  };
}

export function createDragon(scene, pos) {
  const root = new BABYLON.TransformNode("dragonRoot", scene);
  root.position = pos.clone();

  const blue = mat(scene, "dragonBlue", 0.05, 0.38, 0.95);
  blue.emissiveColor = new BABYLON.Color3(0.02, 0.08, 0.18);

  const dark = mat(scene, "dragonDark", 0.02, 0.12, 0.35);
  const saddleMat = mat(scene, "saddle", 0.25, 0.12, 0.05);

  const body = BABYLON.MeshBuilder.CreateSphere("dragonBody", {
    diameterX: 3.6,
    diameterY: 2.1,
    diameterZ: 6.4
  }, scene);
  body.parent = root;
  body.material = blue;

  const head = BABYLON.MeshBuilder.CreateSphere("dragonHead", {
    diameter: 1.8
  }, scene);
  head.parent = root;
  head.position = new BABYLON.Vector3(0, 0.55, 3.8);
  head.material = blue;

  const snout = box(scene, "dragonSnout", 1.1, 0.55, 1.2, blue, root, 0, 0.38, 4.75);

  const leftWing = box(scene, "leftWing", 7.5, 0.16, 3.2, dark, root, -4.2, 0.35, 0.2);
  leftWing.rotation.z = 0.25;

  const rightWing = box(scene, "rightWing", 7.5, 0.16, 3.2, dark, root, 4.2, 0.35, 0.2);
  rightWing.rotation.z = -0.25;

  const tail = BABYLON.MeshBuilder.CreateCylinder("dragonTail", {
    diameterTop: 0.25,
    diameterBottom: 1.05,
    height: 6
  }, scene);
  tail.parent = root;
  tail.position = new BABYLON.Vector3(0, -0.2, -5.3);
  tail.rotation.x = Math.PI / 2;
  tail.material = blue;

  const saddle = box(scene, "saddleBox", 1.4, 0.35, 1.4, saddleMat, root, 0, 1.3, 0.4);

  return {
    root,
    body,
    head,
    leftWing,
    rightWing,
    saddle,
    flap: 0,
    angle: 0,
    fireCooldown: 0
  };
}

export function createBrom(scene, pos) {
  const root = new BABYLON.TransformNode("bromRoot", scene);
  root.position = pos.clone();

  const robe = mat(scene, "bromRobe", 0.28, 0.13, 0.08);
  const grey = mat(scene, "bromGrey", 0.75, 0.75, 0.72);
  const wood = mat(scene, "bromStaff", 0.45, 0.25, 0.1);

  const body = BABYLON.MeshBuilder.CreateCylinder("bromBody", {
    diameterTop: 1.1,
    diameterBottom: 1.55,
    height: 2.8
  }, scene);
  body.parent = root;
  body.position.y = 1.45;
  body.material = robe;

  sphere(scene, "bromHead", 0.78, grey, root, 0, 3.0, 0);
  sphere(scene, "bromBeard", 0.5, grey, root, 0, 2.55, 0.35);

  const staff = BABYLON.MeshBuilder.CreateCylinder("staff", {
    diameter: 0.14,
    height: 3.6
  }, scene);
  staff.parent = root;
  staff.position = new BABYLON.Vector3(0.9, 1.8, 0);
  staff.rotation.z = 0.08;
  staff.material = wood;

  return { root, body };
}

export function createVillagers(scene) {
  const places = [
    [-7, 0, 7],
    [12, 0, -5],
    [-16, 0, -8],
    [6, 0, -16]
  ];

  return places.map((p, i) => {
    const root = new BABYLON.TransformNode(`villagerRoot${i}`, scene);
    root.position = new BABYLON.Vector3(p[0], 0, p[2]);

    const color = mat(scene, `villagerMat${i}`, 0.5, 0.35 + i * 0.08, 0.2 + i * 0.07);

    box(scene, `villagerBody${i}`, 1, 2, 0.8, color, root, 0, 1.4, 0);
    sphere(scene, `villagerHead${i}`, 0.7, color, root, 0, 2.75, 0);

    return { root };
  });
}

export function createEnemies(scene) {
  const places = [
    [54, 0, -21],
    [61, 0, -30],
    [69, 0, -24],
    [58, 0, -36],
    [73, 0, -33]
  ];

  return places.map((p, i) => {
    const root = new BABYLON.TransformNode(`enemyRoot${i}`, scene);
    root.position = new BABYLON.Vector3(p[0], 0, p[2]);

    const red = mat(scene, `enemyRed${i}`, 0.55, 0.06, 0.06);
    const black = mat(scene, `enemyBlack${i}`, 0.06, 0.05, 0.05);

    const body = box(scene, `enemyBody${i}`, 1.15, 2.25, 0.85, red, root, 0, 1.45, 0);
    sphere(scene, `enemyHead${i}`, 0.75, black, root, 0, 2.85, 0);

    const hpBack = BABYLON.MeshBuilder.CreatePlane(`enemyHpBack${i}`, {
      width: 2.2,
      height: 0.22
    }, scene);
    hpBack.parent = root;
    hpBack.position.y = 3.7;
    hpBack.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    const backMat = mat(scene, `enemyHpBackMat${i}`, 0.05, 0.05, 0.05);
    hpBack.material = backMat;

    const hpFront = BABYLON.MeshBuilder.CreatePlane(`enemyHpFront${i}`, {
      width: 2,
      height: 0.16
    }, scene);
    hpFront.parent = root;
    hpFront.position.y = 3.7;
    hpFront.position.z = -0.02;
    hpFront.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    const hpMat = mat(scene, `enemyHpMat${i}`, 1, 0.05, 0.05);
    hpFront.material = hpMat;

    return {
      root,
      body,
      hp: 100,
      maxHp: 100,
      hpFront,
      alive: true,
      attackCooldown: 0
    };
  });
}

function mat(scene, name, r, g, b) {
  const m = new BABYLON.StandardMaterial(name, scene);
  m.diffuseColor = new BABYLON.Color3(r, g, b);
  return m;
}

function box(scene, name, w, h, d, material, parent, x, y, z) {
  const mesh = BABYLON.MeshBuilder.CreateBox(name, {
    width: w,
    height: h,
    depth: d
  }, scene);

  mesh.parent = parent;
  mesh.position = new BABYLON.Vector3(x, y, z);
  mesh.material = material;

  return mesh;
}

function sphere(scene, name, diameter, material, parent, x, y, z) {
  const mesh = BABYLON.MeshBuilder.CreateSphere(name, {
    diameter
  }, scene);

  mesh.parent = parent;
  mesh.position = new BABYLON.Vector3(x, y, z);
  mesh.material = material;

  return mesh;
}
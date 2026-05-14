export function createWorld(scene) {
  scene.clearColor = new BABYLON.Color4(0.55, 0.78, 1, 1);

  const hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = 0.9;

  const sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -2, -1), scene);
  sun.position = new BABYLON.Vector3(40, 80, 30);
  sun.intensity = 0.75;

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 260,
    height: 260
  }, scene);

  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.22, 0.55, 0.25);
  ground.material = groundMat;

  createRoad(scene);
  createVillage(scene);
  createForest(scene);
  createMountains(scene);
  createEnemyCamp(scene);
  createMagicLake(scene);

  return {
    playerSpawn: new BABYLON.Vector3(0, 1.2, 18),
    bromPosition: new BABYLON.Vector3(5, 0, 9),
    dragonStart: new BABYLON.Vector3(-10, 6, 12),
    campCenter: new BABYLON.Vector3(62, 0, -28)
  };
}

function createRoad(scene) {
  const mat = new BABYLON.StandardMaterial("roadMat", scene);
  mat.diffuseColor = new BABYLON.Color3(0.55, 0.43, 0.31);

  const road = BABYLON.MeshBuilder.CreateGround("road", {
    width: 12,
    height: 115
  }, scene);

  road.position.z = -18;
  road.position.y = 0.02;
  road.material = mat;
}

function createVillage(scene) {
  const wood = new BABYLON.StandardMaterial("wood", scene);
  wood.diffuseColor = new BABYLON.Color3(0.55, 0.35, 0.18);

  const roof = new BABYLON.StandardMaterial("roof", scene);
  roof.diffuseColor = new BABYLON.Color3(0.22, 0.12, 0.08);

  const spots = [
    [-14, 3, 8], [-10, 3, -7], [11, 3, 3],
    [17, 3, -10], [0, 3, -16], [-20, 3, -15]
  ];

  spots.forEach((p, i) => {
    const base = BABYLON.MeshBuilder.CreateBox(`house${i}`, {
      width: 8,
      depth: 8,
      height: 6
    }, scene);
    base.position = new BABYLON.Vector3(p[0], p[1], p[2]);
    base.material = wood;

    const top = BABYLON.MeshBuilder.CreateCylinder(`roof${i}`, {
      diameterTop: 0,
      diameterBottom: 11,
      height: 4.5,
      tessellation: 4
    }, scene);
    top.position = new BABYLON.Vector3(p[0], p[1] + 5.2, p[2]);
    top.rotation.y = Math.PI / 4;
    top.material = roof;
  });
}

function createForest(scene) {
  const trunkMat = new BABYLON.StandardMaterial("trunkMat", scene);
  trunkMat.diffuseColor = new BABYLON.Color3(0.38, 0.22, 0.09);

  const leavesMat = new BABYLON.StandardMaterial("leavesMat", scene);
  leavesMat.diffuseColor = new BABYLON.Color3(0.08, 0.42, 0.14);

  for (let i = 0; i < 45; i++) {
    const x = -95 + Math.random() * 190;
    const z = -100 + Math.random() * 190;

    if (Math.abs(x) < 25 && Math.abs(z) < 25) continue;

    const trunk = BABYLON.MeshBuilder.CreateCylinder(`trunk${i}`, {
      diameter: 1.1,
      height: 5
    }, scene);
    trunk.position = new BABYLON.Vector3(x, 2.5, z);
    trunk.material = trunkMat;

    const leaves = BABYLON.MeshBuilder.CreateSphere(`leaves${i}`, {
      diameter: 5
    }, scene);
    leaves.position = new BABYLON.Vector3(x, 6.3, z);
    leaves.material = leavesMat;
  }
}

function createMountains(scene) {
  const mat = new BABYLON.StandardMaterial("mountainMat", scene);
  mat.diffuseColor = new BABYLON.Color3(0.36, 0.38, 0.43);

  const positions = [
    [-95, -90], [-65, -105], [-25, -112], [25, -110],
    [70, -100], [102, -80], [-110, 20], [110, 30]
  ];

  positions.forEach((p, i) => {
    const height = 25 + Math.random() * 22;

    const m = BABYLON.MeshBuilder.CreateCylinder(`mountain${i}`, {
      diameterTop: 0,
      diameterBottom: 32 + Math.random() * 20,
      height,
      tessellation: 5
    }, scene);

    m.position = new BABYLON.Vector3(p[0], height / 2, p[1]);
    m.rotation.y = Math.random() * Math.PI;
    m.material = mat;
  });
}

function createEnemyCamp(scene) {
  const tentMat = new BABYLON.StandardMaterial("tentMat", scene);
  tentMat.diffuseColor = new BABYLON.Color3(0.45, 0.18, 0.14);

  const fireMat = new BABYLON.StandardMaterial("fireMat", scene);
  fireMat.emissiveColor = new BABYLON.Color3(1, 0.35, 0.05);

  const tents = [
    [57, -26], [67, -31], [62, -18]
  ];

  tents.forEach((p, i) => {
    const tent = BABYLON.MeshBuilder.CreateCylinder(`tent${i}`, {
      diameterTop: 0,
      diameterBottom: 9,
      height: 6,
      tessellation: 4
    }, scene);

    tent.position = new BABYLON.Vector3(p[0], 3, p[1]);
    tent.rotation.y = Math.PI / 4;
    tent.material = tentMat;
  });

  const fire = BABYLON.MeshBuilder.CreateSphere("campFire", {
    diameter: 2
  }, scene);
  fire.position = new BABYLON.Vector3(62, 1, -25);
  fire.material = fireMat;
}

function createMagicLake(scene) {
  const mat = new BABYLON.StandardMaterial("lakeMat", scene);
  mat.diffuseColor = new BABYLON.Color3(0.1, 0.45, 0.7);
  mat.alpha = 0.65;

  const lake = BABYLON.MeshBuilder.CreateGround("magicLake", {
    width: 28,
    height: 18
  }, scene);

  lake.position = new BABYLON.Vector3(-50, 0.04, 42);
  lake.rotation.y = 0.4;
  lake.material = mat;
}
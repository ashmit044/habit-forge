import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildTown3DScene(
  scene: THREE.Scene,
  growthStage: number
): {
  update: (delta: number, isNight: boolean, nightFactor: number) => void;
  interactables: Interactive3DObject[];
} {
  const group = new THREE.Group();
  scene.add(group);

  const interactables: Interactive3DObject[] = [];
  const nightLights: { light: THREE.PointLight; baseIntensity: number }[] = [];
  const windowEmissives: { mat: THREE.MeshStandardMaterial; maxIntensity: number }[] = [];

  // Materials
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x22543d, roughness: 0.9 });
  const cobbleMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.85 });
  const stoneWallMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 });
  const timberMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
  const roofRedMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
  const roofBlueMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.7 });

  // 1. Terrain Ground
  const terrain = new THREE.Mesh(new THREE.CylinderGeometry(24, 25, 1.2, 32), groundMat);
  terrain.position.y = -0.6;
  terrain.receiveShadow = true;
  group.add(terrain);

  // Cobblestone Crossroads
  const road1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 22), cobbleMat);
  road1.position.set(0, 0.02, 0);
  road1.receiveShadow = true;
  group.add(road1);

  const road2 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.04, 3.2), cobbleMat);
  road2.position.set(0, 0.02, 2);
  road2.receiveShadow = true;
  group.add(road2);

  // 2. Central Fountain in Town Square
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(0, 0, 2);

  const fBasin = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 0.5, 16), stoneWallMat);
  fBasin.position.y = 0.25;
  fBasin.castShadow = true;
  fBasin.receiveShadow = true;
  fountainGroup.add(fBasin);

  const fWater = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.52, 16), new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
  }));
  fWater.position.y = 0.26;
  fountainGroup.add(fWater);

  const fSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.8, 8), stoneWallMat);
  fSpire.position.y = 1.0;
  fSpire.castShadow = true;
  fountainGroup.add(fSpire);

  // Fountain Night Glow
  const fountainLight = new THREE.PointLight(0x38bdf8, 0, 6, 2);
  fountainLight.position.set(0, 0.8, 0);
  fountainGroup.add(fountainLight);
  nightLights.push({ light: fountainLight, baseIntensity: 1.0 });

  group.add(fountainGroup);

  // Helper to create a realistic window with warm interior illumination
  const createWarmWindow = (w: number, h: number, maxGlow = 1.8) => {
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: new THREE.Color(0xfde047),
      emissiveIntensity: 0,
      roughness: 0.3,
    });
    windowEmissives.push({ mat: winMat, maxIntensity: maxGlow });
    const winMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), winMat);
    return winMesh;
  };

  // 3. Imperial Monarch Castle Keep (Stage 3+)
  const castleGroup = new THREE.Group();
  castleGroup.position.set(0, 0, -5);

  const castleScale = growthStage >= 5 ? 1.4 : 1.0;
  const keep = new THREE.Mesh(new THREE.BoxGeometry(6 * castleScale, 5 * castleScale, 5 * castleScale), stoneWallMat);
  keep.position.y = (2.5 * castleScale);
  keep.castShadow = true;
  keep.receiveShadow = true;
  castleGroup.add(keep);

  // Castle Windows
  const cWin1 = createWarmWindow(0.6 * castleScale, 1.0 * castleScale, 2.0);
  cWin1.position.set(-1.4 * castleScale, 3.2 * castleScale, 2.55 * castleScale);
  castleGroup.add(cWin1);

  const cWin2 = createWarmWindow(0.6 * castleScale, 1.0 * castleScale, 1.5);
  cWin2.position.set(1.4 * castleScale, 3.2 * castleScale, 2.55 * castleScale);
  castleGroup.add(cWin2);

  // Castle Entrance Torch Light
  const castleDoorLight = new THREE.PointLight(0xfef08a, 0, 10, 2);
  castleDoorLight.position.set(0, 2.0 * castleScale, 3.0 * castleScale);
  castleGroup.add(castleDoorLight);
  nightLights.push({ light: castleDoorLight, baseIntensity: 2.2 });

  // Castle Corner Towers
  const towerPositions = [
    { x: -3.2 * castleScale, z: -2.7 * castleScale },
    { x: 3.2 * castleScale, z: -2.7 * castleScale },
    { x: -3.2 * castleScale, z: 2.7 * castleScale },
    { x: 3.2 * castleScale, z: 2.7 * castleScale },
  ];

  towerPositions.forEach((pos) => {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.0 * castleScale, 1.2 * castleScale, 7 * castleScale, 8), stoneWallMat);
    tower.position.set(pos.x, 3.5 * castleScale, pos.z);
    tower.castShadow = true;
    tower.receiveShadow = true;
    castleGroup.add(tower);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.4 * castleScale, 2.5 * castleScale, 8), roofBlueMat);
    roof.position.set(pos.x, 8.0 * castleScale, pos.z);
    roof.castShadow = true;
    castleGroup.add(roof);
  });

  group.add(castleGroup);
  interactables.push({
    id: 'monarch_castle',
    name: 'Monarch Castle Keep',
    type: 'Royal Citadel',
    description: 'The sovereign stone keep presiding over your growing empire.',
    level: growthStage,
    tier: 5,
    mesh: castleGroup,
  });

  // 4. Highland Windmill
  const millGroup = new THREE.Group();
  millGroup.position.set(-7, 0, -2);

  const millBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 5, 8), stoneWallMat);
  millBase.position.y = 2.5;
  millBase.castShadow = true;
  millGroup.add(millBase);

  // Windmill Window
  const millWin = createWarmWindow(0.5, 0.7, 1.8);
  millWin.position.set(0, 3.2, 1.7);
  millGroup.add(millWin);

  const millRoof = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.8, 8), roofRedMat);
  millRoof.position.y = 5.9;
  millRoof.castShadow = true;
  millGroup.add(millRoof);

  const sailsGroup = new THREE.Group();
  sailsGroup.position.set(0, 5.0, 1.8);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const spar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.0, 0.12), timberMat);
    spar.position.set(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0);
    spar.rotation.z = angle;
    spar.castShadow = true;
    sailsGroup.add(spar);

    const blade = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.8), new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      roughness: 0.9,
    }));
    blade.position.set(Math.cos(angle) * 1.8 + Math.sin(angle) * 0.4, Math.sin(angle) * 1.8 - Math.cos(angle) * 0.4, 0.05);
    blade.rotation.z = angle;
    sailsGroup.add(blade);
  }

  millGroup.add(sailsGroup);
  group.add(millGroup);
  interactables.push({
    id: 'grain_mill',
    name: 'Highland Windmill',
    type: 'Resource Mill',
    description: 'Harnesses daily breezes to grind grain into royal coin.',
    level: 1,
    tier: 2,
    mesh: millGroup,
  });

  // 5. Artisan Timber Cottage (Stage 1+)
  const cottageGroup = new THREE.Group();
  cottageGroup.position.set(6, 0, 3);

  const cWalls = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.5, 3.2), stoneWallMat);
  cWalls.position.y = 1.25;
  cWalls.castShadow = true;
  cWalls.receiveShadow = true;
  cottageGroup.add(cWalls);

  // Cottage Warm Windows
  const cFrontWin = createWarmWindow(0.8, 0.8, 2.0);
  cFrontWin.position.set(0.9, 1.4, 1.62);
  cottageGroup.add(cFrontWin);

  const cSideWin = createWarmWindow(0.8, 0.8, 1.4);
  cSideWin.rotation.y = Math.PI / 2;
  cSideWin.position.set(1.82, 1.4, 0);
  cottageGroup.add(cSideWin);

  // Cottage Entrance Sconce Light
  const cottageLight = new THREE.PointLight(0xfef08a, 0, 7, 2);
  cottageLight.position.set(-0.8, 1.6, 2.0);
  cottageGroup.add(cottageLight);
  nightLights.push({ light: cottageLight, baseIntensity: 1.8 });

  const cRoof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 1.8, 4), roofRedMat);
  cRoof.position.y = 3.2;
  cRoof.rotation.y = Math.PI / 4;
  cRoof.castShadow = true;
  cottageGroup.add(cRoof);

  const cChimney = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.2, 0.6), stoneWallMat);
  cChimney.position.set(1.0, 3.2, -0.6);
  cChimney.castShadow = true;
  cottageGroup.add(cChimney);

  group.add(cottageGroup);
  interactables.push({
    id: 'cozy_cottage',
    name: 'Artisan Cottage',
    type: 'Guild Housing',
    description: 'Cozy stone-and-timber cottage housing kingdom craftsmen.',
    level: 1,
    tier: 1,
    mesh: cottageGroup,
  });

  // 6. Guild Market Stalls
  const marketGroup = new THREE.Group();
  marketGroup.position.set(-5, 0, 5);

  const stall = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.0, 1.8), timberMat);
  stall.position.y = 0.5;
  stall.castShadow = true;
  marketGroup.add(stall);

  const canopy = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.0, 4), roofBlueMat);
  canopy.position.y = 2.0;
  canopy.rotation.y = Math.PI / 4;
  canopy.castShadow = true;
  marketGroup.add(canopy);

  // Stall hanging lantern
  const stallLight = new THREE.PointLight(0xfde047, 0, 6, 2);
  stallLight.position.set(0, 1.6, 0.8);
  marketGroup.add(stallLight);
  nightLights.push({ light: stallLight, baseIntensity: 1.5 });

  group.add(marketGroup);
  interactables.push({
    id: 'market_square',
    name: 'Guild Bazaar Stall',
    type: 'Trade Center',
    description: 'Bustling merchant stalls trading harvested daily habit rewards.',
    level: 1,
    tier: 1,
    mesh: marketGroup,
  });

  // 7. Realistic Wrought-Iron Streetlights Spaced Along Roads
  const streetlightPositions = [
    { x: 2.2, z: 5.5 },
    { x: -2.2, z: 5.5 },
    { x: 2.2, z: -1.5 },
    { x: -2.2, z: -1.5 },
    { x: -6.5, z: 0.5 },
    { x: 6.5, z: 0.5 },
  ];

  streetlightPositions.forEach((pos) => {
    const lampGroup = new THREE.Group();
    lampGroup.position.set(pos.x, 0, pos.z);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.4, 8), stoneWallMat);
    base.position.y = 0.2;
    lampGroup.add(base);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.6, 8), ironMat);
    post.position.y = 1.5;
    post.castShadow = true;
    lampGroup.add(post);

    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: new THREE.Color(0xfde047),
      emissiveIntensity: 0,
    });
    windowEmissives.push({ mat: lanternMat, maxIntensity: 2.2 });

    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.35, 6), lanternMat);
    glass.position.y = 2.8;
    lampGroup.add(glass);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.2, 6), ironMat);
    cap.position.y = 3.05;
    lampGroup.add(cap);

    // Physical Point Light casting warm illumination onto the road
    const pLight = new THREE.PointLight(0xfef08a, 0, 9, 2);
    pLight.position.set(0, 2.8, 0);
    lampGroup.add(pLight);
    nightLights.push({ light: pLight, baseIntensity: 1.8 });

    group.add(lampGroup);
  });

  return {
    update: (delta: number, isNight: boolean, nightFactor: number) => {
      sailsGroup.rotation.z += delta * 0.8;

      nightLights.forEach(({ light, baseIntensity }) => {
        light.intensity = THREE.MathUtils.lerp(0, baseIntensity, nightFactor);
      });

      windowEmissives.forEach(({ mat, maxIntensity }) => {
        mat.emissiveIntensity = THREE.MathUtils.lerp(0, maxIntensity, nightFactor);
      });
    },
    interactables,
  };
}

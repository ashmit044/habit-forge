import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildTown3DScene(
  scene: THREE.Scene,
  growthStage: number
): { update: (delta: number) => void; interactables: Interactive3DObject[] } {
  const group = new THREE.Group();
  scene.add(group);

  const interactables: Interactive3DObject[] = [];

  // Materials
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.9 });
  const cobbleMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.8 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.7 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
  const redBannerMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });
  const windowGlowMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

  // 1. Cobblestone Island Base
  const baseGeo = new THREE.CylinderGeometry(24, 25, 1.2, 32);
  const base = new THREE.Mesh(baseGeo, groundMat);
  base.position.y = -0.6;
  base.receiveShadow = true;
  group.add(base);

  // Town Square Crossroads
  const road1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.05, 20), cobbleMat);
  road1.position.set(0, 0.02, 0);
  road1.receiveShadow = true;
  group.add(road1);

  const road2 = new THREE.Mesh(new THREE.BoxGeometry(20, 0.05, 4), cobbleMat);
  road2.position.set(0, 0.02, 0);
  road2.receiveShadow = true;
  group.add(road2);

  // Town Square Central Fountain
  const fountain = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.6, 12), stoneMat);
  fountain.position.set(0, 0.3, 0);
  fountain.castShadow = true;
  group.add(fountain);

  const fountainSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.4, 8), stoneMat);
  fountainSpout.position.set(0, 0.8, 0);
  group.add(fountainSpout);

  // 2. Central Monarch Castle Keep (Stage 1 to 5)
  const castleGroup = new THREE.Group();
  castleGroup.position.set(0, 0, -5);

  const castleWidth = growthStage >= 5 ? 7 : 5;
  const castleHeight = growthStage >= 5 ? 6.5 : 4.5;

  const keep = new THREE.Mesh(new THREE.BoxGeometry(castleWidth, castleHeight, 4.5), stoneMat);
  keep.position.y = castleHeight / 2;
  keep.castShadow = true;
  castleGroup.add(keep);

  // Corner Towers
  const towerPositions = [
    { x: -castleWidth / 2, z: -2.2 },
    { x: castleWidth / 2, z: -2.2 },
    { x: -castleWidth / 2, z: 2.2 },
    { x: castleWidth / 2, z: 2.2 },
  ];

  towerPositions.forEach((pos) => {
    const tTower = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, castleHeight + 2, 8), stoneMat);
    tTower.position.set(pos.x, (castleHeight + 2) / 2, pos.z);
    tTower.castShadow = true;
    castleGroup.add(tTower);

    const tRoof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.8, 8), roofMat);
    tRoof.position.set(pos.x, castleHeight + 2.9, pos.z);
    tRoof.castShadow = true;
    castleGroup.add(tRoof);
  });

  // Castle Crown Flag (Stage 5)
  if (growthStage >= 5) {
    const flagpole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3, 6), woodMat);
    flagpole.position.set(0, castleHeight + 1.5, 0);
    castleGroup.add(flagpole);

    const flag = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.05), redBannerMat);
    flag.position.set(0.8, castleHeight + 2.4, 0);
    castleGroup.add(flag);
  }

  group.add(castleGroup);
  interactables.push({
    id: 'royal_castle',
    name: 'Castle of the Grand Monarch',
    type: 'Sovereign Keep',
    description: 'The royal seat of governance forged one daily habit at a time.',
    level: growthStage,
    tier: 5,
    mesh: castleGroup,
  });

  // 3. Highland Windmill (Stage 2+)
  const windmillGroup = new THREE.Group();
  windmillGroup.position.set(-7, 0, -2);

  const millBody = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.2, 5.5, 8), stoneMat);
  millBody.position.y = 2.75;
  millBody.castShadow = true;
  windmillGroup.add(millBody);

  const millRoof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.6, 8), roofMat);
  millRoof.position.y = 6.3;
  millRoof.castShadow = true;
  windmillGroup.add(millRoof);

  // Rotating Sails
  const sailsGroup = new THREE.Group();
  sailsGroup.position.set(0, 5.2, 1.4);

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 8), woodMat);
  hub.rotation.x = Math.PI / 2;
  sailsGroup.add(hub);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const sailArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.5, 0.08), woodMat);
    sailArm.rotation.z = angle;
    sailsGroup.add(sailArm);

    const canvas = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.02), windowGlowMat);
    canvas.position.set(Math.cos(angle + Math.PI / 2) * 1.4, Math.sin(angle + Math.PI / 2) * 1.4, 0.02);
    canvas.rotation.z = angle;
    sailsGroup.add(canvas);
  }

  windmillGroup.add(sailsGroup);
  group.add(windmillGroup);
  interactables.push({
    id: 'grain_windmill',
    name: 'Highland Windmill',
    type: 'Agriculture',
    description: 'Turns continuously with steady daily morning routines.',
    level: 1,
    tier: 2,
    mesh: windmillGroup,
  });

  // 4. Artisan Cottages with Chimneys (Stage 1+)
  const cottageGroup = new THREE.Group();
  cottageGroup.position.set(6, 0, 3);

  const cWalls = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 3.2), woodMat);
  cWalls.position.y = 1.2;
  cWalls.castShadow = true;
  cottageGroup.add(cWalls);

  const cRoof = new THREE.Mesh(new THREE.ConeGeometry(3.2, 1.8, 4), roofMat);
  cRoof.position.y = 3.3;
  cRoof.rotation.y = Math.PI / 4;
  cRoof.castShadow = true;
  cottageGroup.add(cRoof);

  const cChimney = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.2, 0.6), stoneMat);
  cChimney.position.set(1.2, 3.2, 0.6);
  cChimney.castShadow = true;
  cottageGroup.add(cChimney);

  group.add(cottageGroup);
  interactables.push({
    id: 'cozy_cottage',
    name: 'Artisan Cottage',
    type: 'Residential Craft',
    description: 'Warm timber and stone house for hardworking craftspeople.',
    level: 1,
    tier: 1,
    mesh: cottageGroup,
  });

  // 5. Guild Market Stalls (Stage 3+)
  if (growthStage >= 3) {
    const marketGroup = new THREE.Group();
    marketGroup.position.set(-5, 0, 5);

    for (let i = 0; i < 2; i++) {
      const stall = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.6), woodMat);
      stall.position.set(i * 3, 0.4, 0);
      stall.castShadow = true;
      marketGroup.add(stall);

      const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.8, 4), redBannerMat);
      canopy.position.set(i * 3, 1.8, 0);
      canopy.rotation.y = Math.PI / 4;
      marketGroup.add(canopy);
    }

    group.add(marketGroup);
    interactables.push({
      id: 'market_square',
      name: 'Bustling Guild Market',
      type: 'Commerce',
      description: 'Merchants trade exotic supplies and gold coins.',
      level: 1,
      tier: 3,
      mesh: marketGroup,
    });
  }

  // 6. Great Clockwork Spire (Stage 4+)
  if (growthStage >= 4) {
    const clockGroup = new THREE.Group();
    clockGroup.position.set(6, 0, -4);

    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.2, 9, 2.2), stoneMat);
    tower.position.y = 4.5;
    tower.castShadow = true;
    clockGroup.add(tower);

    const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 12), goldMat);
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(0, 7.8, 1.15);
    clockGroup.add(clockFace);

    const spireRoof = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.4, 4), roofMat);
    spireRoof.position.y = 10.2;
    spireRoof.rotation.y = Math.PI / 4;
    clockGroup.add(spireRoof);

    group.add(clockGroup);
    interactables.push({
      id: 'clockwork_tower',
      name: 'Great Clockwork Spire',
      type: 'Civic Landmark',
      description: 'Calibrated to chime on consecutive habit completion streaks.',
      level: 1,
      tier: 4,
      mesh: clockGroup,
    });
  }

  return {
    update: (delta: number) => {
      // Rotate windmill sails
      sailsGroup.rotation.z += delta * 1.5;
    },
    interactables,
  };
}

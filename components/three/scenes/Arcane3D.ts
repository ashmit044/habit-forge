import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildArcane3DScene(
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
  const emissiveMaterials: { mat: THREE.MeshStandardMaterial; maxIntensity: number }[] = [];

  // Materials
  const darkRockMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.85 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
  const crystalMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    emissive: new THREE.Color(0xf43f5e),
    emissiveIntensity: 0.6,
    roughness: 0.1,
  });
  emissiveMaterials.push({ mat: crystalMat, maxIntensity: 2.2 });

  // 1. Floating Inverted Cone Rock Island
  const rockIsland = new THREE.Mesh(new THREE.ConeGeometry(24, 18, 16), darkRockMat);
  rockIsland.rotation.x = Math.PI;
  rockIsland.position.y = -9;
  rockIsland.receiveShadow = true;
  group.add(rockIsland);

  const topPlate = new THREE.Mesh(new THREE.CylinderGeometry(24, 24, 0.6, 32), stoneMat);
  topPlate.position.y = -0.3;
  topPlate.receiveShadow = true;
  group.add(topPlate);

  // Runic Summoning Circle Ring
  const runeRingMat = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    emissive: new THREE.Color(0x6366f1),
    emissiveIntensity: 0.1,
  });
  emissiveMaterials.push({ mat: runeRingMat, maxIntensity: 1.8 });

  const runeRing = new THREE.Mesh(new THREE.TorusGeometry(12, 0.2, 8, 32), runeRingMat);
  runeRing.rotation.x = Math.PI / 2;
  runeRing.position.y = 0.02;
  group.add(runeRing);

  // 2. Central Archmage Spire
  const spireGroup = new THREE.Group();
  spireGroup.position.set(0, 0, 0);

  const spireScale = growthStage >= 5 ? 1.4 : 1.0;
  const baseTower = new THREE.Mesh(new THREE.CylinderGeometry(2.5 * spireScale, 4.0 * spireScale, 8 * spireScale, 8), stoneMat);
  baseTower.position.y = 4 * spireScale;
  baseTower.castShadow = true;
  baseTower.receiveShadow = true;
  spireGroup.add(baseTower);

  const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(2.0 * spireScale, 6 * spireScale, 8), stoneMat);
  pinnacle.position.y = 11 * spireScale;
  pinnacle.castShadow = true;
  spireGroup.add(pinnacle);

  const topCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.2 * spireScale, 0), crystalMat);
  topCrystal.position.y = 15 * spireScale;
  spireGroup.add(topCrystal);

  // Spire Beacon Point Light
  const spireLight = new THREE.PointLight(0xf43f5e, 0, 14, 2);
  spireLight.position.set(0, 15 * spireScale, 0);
  spireGroup.add(spireLight);
  nightLights.push({ light: spireLight, baseIntensity: 2.5 });

  group.add(spireGroup);
  interactables.push({
    id: 'archmage_spire',
    name: 'Archmage Citadel Spire',
    type: 'Arcane Focal Point',
    description: 'Channelling raw cosmic mana into daily habit discipline.',
    level: growthStage,
    tier: 5,
    mesh: spireGroup,
  });

  // 3. Levitating Mana Geode Crystal
  const geodeGroup = new THREE.Group();
  geodeGroup.position.set(6, 2, -4);

  const crystal1 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.5, 6), crystalMat);
  crystal1.rotation.z = 0.2;
  geodeGroup.add(crystal1);

  const crystal2 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.0, 6), crystalMat);
  crystal2.position.set(0.6, 0.4, 0.4);
  crystal2.rotation.z = -0.3;
  geodeGroup.add(crystal2);

  // Crystal Glow Light
  const geodeLight = new THREE.PointLight(0xec4899, 0, 8, 2);
  geodeLight.position.set(0, 1.2, 0);
  geodeGroup.add(geodeLight);
  nightLights.push({ light: geodeLight, baseIntensity: 1.8 });

  group.add(geodeGroup);
  interactables.push({
    id: 'mana_geode',
    name: 'Levitating Mana Crystal',
    type: 'Crystal Node',
    description: 'Zero-gravity crystal formation emitting harmonious mystical frequencies.',
    level: 1,
    tier: 2,
    mesh: geodeGroup,
  });

  // 4. Philosopher's Cauldron
  const cauldronGroup = new THREE.Group();
  cauldronGroup.position.set(-6, 0, 4);

  const pot = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), stoneMat);
  pot.rotation.x = Math.PI;
  pot.position.y = 1.4;
  pot.castShadow = true;
  cauldronGroup.add(pot);

  const brewMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: new THREE.Color(0x34d399),
    emissiveIntensity: 0.6,
  });
  emissiveMaterials.push({ mat: brewMat, maxIntensity: 2.2 });

  const brew = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16), brewMat);
  brew.position.y = 1.35;
  cauldronGroup.add(brew);

  // Potion night point light
  const brewLight = new THREE.PointLight(0x34d399, 0, 8, 2);
  brewLight.position.set(0, 1.6, 0);
  cauldronGroup.add(brewLight);
  nightLights.push({ light: brewLight, baseIntensity: 1.8 });

  group.add(cauldronGroup);
  interactables.push({
    id: 'potion_cauldron',
    name: 'Philosopher’s Cauldron',
    type: 'Alchemy Lab',
    description: 'Transmutes routine effort into radiant wisdom elixir.',
    level: 1,
    tier: 1,
    mesh: cauldronGroup,
  });

  // 5. Perimeter Standing Braziers (Warm Torches along Island edge)
  const brazierPositions = [
    { x: -8, z: -8 },
    { x: 8, z: -8 },
    { x: -8, z: 8 },
    { x: 8, z: 8 },
  ];

  brazierPositions.forEach((pos) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(pos.x, 0, pos.z);

    const bPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.0, 8), stoneMat);
    bPedestal.position.y = 1.0;
    bGroup.add(bPedestal);

    const bBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.4, 0.4, 8), goldMat);
    bBowl.position.y = 2.1;
    bGroup.add(bBowl);

    const flameMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: new THREE.Color(0xfbbf24),
      emissiveIntensity: 0,
    });
    emissiveMaterials.push({ mat: flameMat, maxIntensity: 2.5 });

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.6, 6), flameMat);
    flame.position.y = 2.5;
    bGroup.add(flame);

    const torchLight = new THREE.PointLight(0xf59e0b, 0, 9, 2);
    torchLight.position.set(0, 2.5, 0);
    bGroup.add(torchLight);
    nightLights.push({ light: torchLight, baseIntensity: 1.8 });

    group.add(bGroup);
  });

  let time = 0;

  return {
    update: (delta: number, isNight: boolean, nightFactor: number) => {
      time += delta;
      topCrystal.rotation.y += delta * 1.5;
      geodeGroup.position.y = 2 + Math.sin(time * 1.5) * 0.4;
      geodeGroup.rotation.y += delta * 0.8;

      runeRing.rotation.z += delta * 0.2;

      nightLights.forEach(({ light, baseIntensity }) => {
        light.intensity = THREE.MathUtils.lerp(0, baseIntensity, nightFactor);
      });

      emissiveMaterials.forEach(({ mat, maxIntensity }) => {
        mat.emissiveIntensity = THREE.MathUtils.lerp(0, maxIntensity, nightFactor);
      });
    },
    interactables,
  };
}

import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildSpace3DScene(
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
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3, metalness: 0.9 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.6 });
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.95 });

  // 1. Orbital Platform Disk
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(24, 25, 1.2, 32), deckMat);
  disk.position.y = -0.6;
  disk.receiveShadow = true;
  group.add(disk);

  // Platform Edge Hazard Ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(24.2, 0.4, 8, 32), hullMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.2;
  group.add(ring);

  // 2. Central Singularity Quantum Core
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0, 0);

  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.5, 1.6, 12), hullMat);
  pedestal.position.y = 0.8;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  coreGroup.add(pedestal);

  const orbMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    emissive: new THREE.Color(0xa855f7),
    emissiveIntensity: 0.8,
    roughness: 0.1,
  });
  emissiveMaterials.push({ mat: orbMat, maxIntensity: 2.5 });

  const orb = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), orbMat);
  orb.position.y = 3.8;
  coreGroup.add(orb);

  // Singularity Point Light
  const coreLight = new THREE.PointLight(0xa855f7, 0, 14, 2);
  coreLight.position.set(0, 3.8, 0);
  coreGroup.add(coreLight);
  nightLights.push({ light: coreLight, baseIntensity: 2.2 });

  // Rotating Containment Rings
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.15, 8, 24), hullMat);
  ring1.position.y = 3.8;
  coreGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.15, 8, 24), hullMat);
  ring2.position.y = 3.8;
  ring2.rotation.x = Math.PI / 3;
  coreGroup.add(ring2);

  group.add(coreGroup);
  interactables.push({
    id: 'quantum_core',
    name: 'Singularity Quantum Core',
    type: 'Orbital Reactor',
    description: 'Zero-point energy core sustaining deep-space operations.',
    level: growthStage,
    tier: 5,
    mesh: coreGroup,
  });

  // 3. Lunar Hydroponic Bio-Dome
  const domeGroup = new THREE.Group();
  domeGroup.position.set(-7, 0, 4);

  const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.5, 0.6, 16), hullMat);
  domeBase.position.y = 0.3;
  domeGroup.add(domeBase);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(3.0, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
  dome.position.y = 0.6;
  domeGroup.add(dome);

  // Dome Interior Warm Hydroponic Light
  const domeLight = new THREE.PointLight(0x34d399, 0, 10, 2);
  domeLight.position.set(0, 1.8, 0);
  domeGroup.add(domeLight);
  nightLights.push({ light: domeLight, baseIntensity: 2.0 });

  group.add(domeGroup);
  interactables.push({
    id: 'hydroponic_dome',
    name: 'Lunar Hydro-Dome',
    type: 'Life Support',
    description: 'Pressurized biosphere yielding oxygen and botanical nutrition.',
    level: 1,
    tier: 2,
    mesh: domeGroup,
  });

  // 4. Helios Solar Array
  const solarGroup = new THREE.Group();
  solarGroup.position.set(7, 0, -4);

  const sPylon = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 3.5, 8), hullMat);
  sPylon.position.y = 1.75;
  sPylon.castShadow = true;
  solarGroup.add(sPylon);

  const panel = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.2, 3.0), solarMat);
  panel.position.set(0, 3.8, 0);
  panel.rotation.x = Math.PI / 6;
  panel.castShadow = true;
  solarGroup.add(panel);

  group.add(solarGroup);
  interactables.push({
    id: 'solar_panel',
    name: 'Helios Solar Collector',
    type: 'Photovoltaic Array',
    description: 'High-efficiency solar cells capturing stellar radiation.',
    level: 1,
    tier: 1,
    mesh: solarGroup,
  });

  // 5. Starship Launchpad & Explorer Craft
  if (growthStage >= 3) {
    const shipGroup = new THREE.Group();
    shipGroup.position.set(-6, 0, -5);

    const pad = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.5, 0.4, 16), hullMat);
    pad.position.y = 0.2;
    pad.receiveShadow = true;
    shipGroup.add(pad);

    const craftBody = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4.2, 6), hullMat);
    craftBody.rotation.x = -Math.PI / 2;
    craftBody.position.set(0, 1.4, 0);
    craftBody.castShadow = true;
    shipGroup.add(craftBody);

    // Launchpad edge lights
    const padLight = new THREE.PointLight(0x38bdf8, 0, 8, 2);
    padLight.position.set(0, 1.0, 0);
    shipGroup.add(padLight);
    nightLights.push({ light: padLight, baseIntensity: 1.5 });

    group.add(shipGroup);
    interactables.push({
      id: 'starship_pad',
      name: 'Vanguard Starship Bay',
      type: 'Interstellar Craft',
      description: 'Long-range expedition craft poised for orbital launches.',
      level: 1,
      tier: 3,
      mesh: shipGroup,
    });
  }

  // 6. Perimeter Guidance Bollards (Real 3D Runway Point Lights)
  const bollardPositions = [
    { x: -5, z: 8 },
    { x: 5, z: 8 },
    { x: -9, z: 0 },
    { x: 9, z: 0 },
    { x: -5, z: -8 },
    { x: 5, z: -8 },
  ];

  bollardPositions.forEach((pos) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(pos.x, 0, pos.z);

    const bPost = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 1.2, 6), hullMat);
    bPost.position.y = 0.6;
    bGroup.add(bPost);

    const bBeaconMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: new THREE.Color(0x38bdf8),
      emissiveIntensity: 0,
    });
    emissiveMaterials.push({ mat: bBeaconMat, maxIntensity: 2.0 });

    const bCap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), bBeaconMat);
    bCap.position.y = 1.25;
    bGroup.add(bCap);

    const bLight = new THREE.PointLight(0x38bdf8, 0, 6, 2);
    bLight.position.set(0, 1.25, 0);
    bGroup.add(bLight);
    nightLights.push({ light: bLight, baseIntensity: 1.2 });

    group.add(bGroup);
  });

  return {
    update: (delta: number, isNight: boolean, nightFactor: number) => {
      ring1.rotation.x += delta * 0.9;
      ring1.rotation.y += delta * 0.6;
      ring2.rotation.y += delta * 0.7;
      ring2.rotation.z += delta * 0.5;

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

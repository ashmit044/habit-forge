import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildSpace3DScene(
  scene: THREE.Scene,
  growthStage: number
): { update: (delta: number) => void; interactables: Interactive3DObject[] } {
  const group = new THREE.Group();
  scene.add(group);

  const interactables: Interactive3DObject[] = [];

  // Materials
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4, metalness: 0.7 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 });
  const solarMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.9 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x818cf8, transparent: true, opacity: 0.45, roughness: 0.1 });
  const plantMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });
  const glowPurpleMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
  const glowCyanMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  // 1. Orbital Platform Disk
  const diskGeo = new THREE.CylinderGeometry(24, 25, 0.8, 32);
  const platform = new THREE.Mesh(diskGeo, hullMat);
  platform.position.y = -0.4;
  platform.receiveShadow = true;
  group.add(platform);

  // Orbital Ring Edge
  const ringGeo = new THREE.TorusGeometry(24.2, 0.4, 8, 32);
  const ring = new THREE.Mesh(ringGeo, metalMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.1;
  group.add(ring);

  // 2. Central Singularity Quantum Core / Warp Ring (Stage 1 to 5)
  const coreGroup = new THREE.Group();
  coreGroup.position.set(0, 0, 0);

  const centralSpire = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 4, 12), metalMat);
  centralSpire.position.y = 2;
  centralSpire.castShadow = true;
  coreGroup.add(centralSpire);

  const orb = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16), glowPurpleMat);
  orb.position.y = 5.2;
  coreGroup.add(orb);

  // Rotating Containment Ring
  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.2, 8, 24), glowCyanMat);
  innerRing.position.y = 5.2;
  innerRing.rotation.x = Math.PI / 3;
  coreGroup.add(innerRing);

  // Outer Hyper-Warp Gateway Ring (Stage 5)
  let outerWarpRing: THREE.Mesh | null = null;
  if (growthStage >= 5) {
    const warpGeo = new THREE.TorusGeometry(4.8, 0.35, 12, 32);
    outerWarpRing = new THREE.Mesh(warpGeo, metalMat);
    outerWarpRing.position.y = 5.2;
    coreGroup.add(outerWarpRing);
  }

  group.add(coreGroup);
  interactables.push({
    id: 'warp_gate',
    name: 'Hyper-Warp Ring & Core',
    type: 'Propulsion Gateway',
    description: 'Bends spacetime through deep focus work and engineering sprints.',
    level: growthStage,
    tier: 5,
    mesh: coreGroup,
  });

  // 3. Lunar Hydroponic Bio-Dome (Stage 2+)
  if (growthStage >= 2) {
    const domeGroup = new THREE.Group();
    domeGroup.position.set(-6, 0, 4);

    const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 0.6, 16), metalMat);
    domeBase.position.y = 0.3;
    domeBase.castShadow = true;
    domeGroup.add(domeBase);

    const domeGlass = new THREE.Mesh(new THREE.SphereGeometry(3.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
    domeGlass.position.y = 0.6;
    domeGroup.add(domeGlass);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const crop = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 1), plantMat);
      crop.position.set(Math.cos(angle) * 1.6, 1.2, Math.sin(angle) * 1.6);
      domeGroup.add(crop);
    }

    group.add(domeGroup);
    interactables.push({
      id: 'hydroponic_dome',
      name: 'Lunar Hydro-Dome',
      type: 'Life Support',
      description: 'Sustains organic crops in zero gravity with unbroken daily habits.',
      level: 1,
      tier: 2,
      mesh: domeGroup,
    });
  }

  // 4. Helios Solar Array Pylons (Stage 1+)
  const solarGroup = new THREE.Group();
  solarGroup.position.set(7, 0, -4);

  const sPylon = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.5, 8), metalMat);
  sPylon.position.y = 1.75;
  sPylon.castShadow = true;
  solarGroup.add(sPylon);

  const panel1 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 2.2, 0.15), solarMat);
  panel1.position.set(0, 3.8, 0);
  panel1.rotation.x = Math.PI / 4;
  panel1.castShadow = true;
  solarGroup.add(panel1);

  group.add(solarGroup);
  interactables.push({
    id: 'solar_panel',
    name: 'Helios Solar Collector',
    type: 'Stellar Energy',
    description: 'Harvests solar radiation to power orbital computing servers.',
    level: 1,
    tier: 1,
    mesh: solarGroup,
  });

  // 5. Orbital Starship Pad & Explorer (Stage 3+)
  let shipMesh: THREE.Object3D | null = null;
  if (growthStage >= 3) {
    const padGroup = new THREE.Group();
    padGroup.position.set(-6, 0, -5);

    const pad = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.6, 0.4, 16), metalMat);
    pad.position.y = 0.2;
    pad.receiveShadow = true;
    padGroup.add(pad);

    const ship = new THREE.Group();
    ship.position.set(0, 1.4, 0);

    const fuselage = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.6, 6), hullMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.castShadow = true;
    ship.add(fuselage);

    const wingL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.2), metalMat);
    wingL.position.set(-1.2, 0, -0.4);
    ship.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.2), metalMat);
    wingR.position.set(1.2, 0, -0.4);
    ship.add(wingR);

    padGroup.add(ship);
    shipMesh = ship;

    group.add(padGroup);
    interactables.push({
      id: 'starship_pad',
      name: 'Orbital Launch Bay',
      type: 'Space Exploration',
      description: 'Prepares explorer starships for deep space recon missions.',
      level: 1,
      tier: 3,
      mesh: padGroup,
    });
  }

  // 6. Deep Space Background Starfield
  const starGeo = new THREE.BufferGeometry();
  const starCount = 60;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 40;
    starPositions[i + 1] = 2 + Math.random() * 20;
    starPositions[i + 2] = (Math.random() - 0.5) * 40;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25 });
  const starParticles = new THREE.Points(starGeo, starMat);
  group.add(starParticles);

  let time = 0;

  return {
    update: (delta: number) => {
      time += delta;
      innerRing.rotation.z += delta * 1.5;
      innerRing.rotation.y += delta * 0.8;
      orb.position.y = 5.2 + Math.sin(time * 2) * 0.2;

      if (outerWarpRing) {
        outerWarpRing.rotation.z -= delta * 0.6;
      }

      if (shipMesh) {
        shipMesh.position.y = 1.4 + Math.sin(time * 1.5) * 0.15;
      }
    },
    interactables,
  };
}

import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildArcane3DScene(
  scene: THREE.Scene,
  growthStage: number
): { update: (delta: number) => void; interactables: Interactive3DObject[] } {
  const group = new THREE.Group();
  scene.add(group);

  const interactables: Interactive3DObject[] = [];

  // Materials
  const islandMat = new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.8 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.6 });
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.9 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
  const cauldronMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.4, metalness: 0.6 });
  const glowPinkMat = new THREE.MeshBasicMaterial({ color: 0xf472b6 });
  const glowVioletMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

  // 1. Floating Arcane Island Base
  const islandGeo = new THREE.ConeGeometry(24, 10, 24);
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.rotation.x = Math.PI;
  island.position.y = -5.0;
  island.receiveShadow = true;
  group.add(island);

  // Runic Summoning Ring on Surface
  const ringGeo = new THREE.TorusGeometry(18, 0.3, 8, 32);
  const ring = new THREE.Mesh(ringGeo, glowVioletMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  group.add(ring);

  // 2. Central Archmage Pinnacle Spire (Stage 1 to 5)
  const spireGroup = new THREE.Group();
  spireGroup.position.set(0, 0, 0);

  const spireHeight = growthStage >= 5 ? 10 : 7;
  const spireBase = new THREE.Mesh(new THREE.ConeGeometry(2.4, spireHeight, 6), stoneMat);
  spireBase.position.y = spireHeight / 2;
  spireBase.castShadow = true;
  spireGroup.add(spireBase);

  // Floating Crown Stones (Stage 5)
  const floatingStones: THREE.Mesh[] = [];
  if (growthStage >= 5) {
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 1), crystalMat);
      stone.position.set(Math.cos(angle) * 3.2, spireHeight + 1.2, Math.sin(angle) * 3.2);
      spireGroup.add(stone);
      floatingStones.push(stone);
    }
  }

  // Spire Tip Orb
  const tipOrb = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), glowPinkMat);
  tipOrb.position.y = spireHeight + 0.8;
  spireGroup.add(tipOrb);

  group.add(spireGroup);
  interactables.push({
    id: 'archmage_nexus',
    name: 'Astral Archmage Nexus',
    type: 'Arcane Citadel',
    description: 'Pinnacle of sorcery where internal willpower transforms reality.',
    level: growthStage,
    tier: 5,
    mesh: spireGroup,
  });

  // 3. Levitating Mana Crystal (Stage 2+)
  let crystalMesh: THREE.Object3D | null = null;
  if (growthStage >= 2) {
    const crystalGroup = new THREE.Group();
    crystalGroup.position.set(6, 2, -4);

    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), crystalMat);
    crystal.castShadow = true;
    crystalGroup.add(crystal);

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 1.6, 6), stoneMat);
    pedestal.position.y = -2.0;
    crystalGroup.add(pedestal);

    group.add(crystalGroup);
    crystalMesh = crystal;
    interactables.push({
      id: 'crystal_pillar',
      name: 'Levitating Mana Crystal',
      type: 'Aether Conduit',
      description: 'Channels elemental energies into protective spell shields.',
      level: 1,
      tier: 2,
      mesh: crystalGroup,
    });
  }

  // 4. Alchemy Courtyard & Philosopher's Cauldron (Stage 1+)
  const cauldronGroup = new THREE.Group();
  cauldronGroup.position.set(-6, 0, 4);

  const cauldron = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), cauldronMat);
  cauldron.position.y = 1.2;
  cauldron.castShadow = true;
  cauldronGroup.add(cauldron);

  const potionLiquid = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.2, 16), glowPinkMat);
  potionLiquid.position.y = 2.0;
  cauldronGroup.add(potionLiquid);

  group.add(cauldronGroup);
  interactables.push({
    id: 'potion_cauldron',
    name: 'Philosopher’s Cauldron',
    type: 'Alchemy',
    description: 'Brews elixirs of energy from daily habit completions.',
    level: 1,
    tier: 1,
    mesh: cauldronGroup,
  });

  // 5. Celestial Orrery Astrolabe (Stage 3+)
  const orreryGroup = new THREE.Group();
  orreryGroup.position.set(-6, 0, -5);

  const oStand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 3, 8), stoneMat);
  oStand.position.y = 1.5;
  orreryGroup.add(oStand);

  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.1, 6, 24), goldMat);
  ring1.position.y = 3.6;
  ring1.rotation.x = Math.PI / 4;
  orreryGroup.add(ring1);

  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 6, 24), goldMat);
  ring2.position.y = 3.6;
  ring2.rotation.y = Math.PI / 3;
  orreryGroup.add(ring2);

  const orreryOrb = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), glowPinkMat);
  orreryOrb.position.y = 3.6;
  orreryGroup.add(orreryOrb);

  group.add(orreryGroup);
  interactables.push({
    id: 'astral_telescope',
    name: 'Orrery of the Cosmos',
    type: 'Divination',
    description: 'Tracks celestial alignments to forecast auspicious habit days.',
    level: 1,
    tier: 3,
    mesh: orreryGroup,
  });

  let time = 0;

  return {
    update: (delta: number) => {
      time += delta;

      if (crystalMesh) {
        crystalMesh.position.y = Math.sin(time * 1.5) * 0.4;
        crystalMesh.rotation.y += delta * 0.8;
      }

      ring1.rotation.z += delta * 0.9;
      ring2.rotation.x += delta * 1.1;

      floatingStones.forEach((st, idx) => {
        st.position.y = spireHeight + 1.2 + Math.sin(time * 2 + idx) * 0.25;
      });
    },
    interactables,
  };
}

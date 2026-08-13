import * as THREE from 'three';

export interface Interactive3DObject {
  id: string;
  name: string;
  type: string;
  description: string;
  level: number;
  tier: number;
  mesh: THREE.Object3D;
}

export function buildGarden3DScene(
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
  const emissiveMaterials: { mat: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial; baseEmissive: THREE.Color; maxIntensity: number }[] = [];

  // Base Materials
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.85, metalness: 0.05 });
  const pathMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.85 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.65 });
  const leafLightMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.55 });
  const sakuraMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.55 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 });

  // 1. Terrain Ground
  const terrainGeo = new THREE.CylinderGeometry(24, 25, 1.2, 32);
  const terrain = new THREE.Mesh(terrainGeo, grassMat);
  terrain.position.y = -0.6;
  terrain.receiveShadow = true;
  group.add(terrain);

  // Outer Decorative Stone Ring
  const ringGeo = new THREE.TorusGeometry(24.2, 0.4, 8, 32);
  const ring = new THREE.Mesh(ringGeo, stoneMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.2;
  group.add(ring);

  // 2. Pathways
  const path1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 16), pathMat);
  path1.position.set(0, 0.04, 6);
  path1.receiveShadow = true;
  group.add(path1);

  const path2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 2.2), pathMat);
  path2.position.set(-2, 0.04, 0);
  path2.receiveShadow = true;
  group.add(path2);

  // 3. Central Ancient World Tree
  const treeGroup = new THREE.Group();
  treeGroup.position.set(0, 0, -1);

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.6, 6, 12), woodMat);
  trunk.position.y = 3;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  treeGroup.add(trunk);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const root = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 2.5, 6), woodMat);
    root.position.set(Math.cos(angle) * 1.4, 0.5, Math.sin(angle) * 1.4);
    root.rotation.z = Math.cos(angle) * 0.4;
    root.rotation.x = Math.sin(angle) * 0.4;
    root.castShadow = true;
    treeGroup.add(root);
  }

  const foliageRadius = growthStage >= 5 ? 4.2 : growthStage >= 3 ? 3.2 : 2.2;
  const foliageHeight = growthStage >= 5 ? 7.5 : 5.8;

  const foliage1 = new THREE.Mesh(new THREE.DodecahedronGeometry(foliageRadius, 1), leafMat);
  foliage1.position.y = foliageHeight;
  foliage1.castShadow = true;
  treeGroup.add(foliage1);

  const foliage2 = new THREE.Mesh(new THREE.DodecahedronGeometry(foliageRadius * 0.75, 1), leafLightMat);
  foliage2.position.set(0.8, foliageHeight + 1.6, -0.4);
  foliage2.castShadow = true;
  treeGroup.add(foliage2);

  const foliage3 = new THREE.Mesh(new THREE.DodecahedronGeometry(foliageRadius * 0.65, 1), leafMat);
  foliage3.position.set(-0.9, foliageHeight + 1.2, 0.6);
  foliage3.castShadow = true;
  treeGroup.add(foliage3);

  // Tree Night Uplight (Illuminates trunk & canopy at night)
  const treeUplight = new THREE.PointLight(0x6ee7b7, 0, 14, 2);
  treeUplight.position.set(0, 1.2, 1.2);
  treeGroup.add(treeUplight);
  nightLights.push({ light: treeUplight, baseIntensity: 1.8 });

  group.add(treeGroup);
  interactables.push({
    id: 'tree_of_life',
    name: 'Eternal Tree of Life',
    type: 'Sanctuary Core',
    description: 'The ancient heart of the botanical sanctuary radiating life essence.',
    level: growthStage,
    tier: 5,
    mesh: treeGroup,
  });

  // 4. Moonlight Lotus Pond (Stage 2+)
  if (growthStage >= 2) {
    const pondGroup = new THREE.Group();
    pondGroup.position.set(-6, 0, 4);

    const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 0.4, 16), stoneMat);
    basin.position.y = 0.2;
    basin.receiveShadow = true;
    pondGroup.add(basin);

    const water = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, 0.42, 16), waterMat);
    water.position.y = 0.22;
    pondGroup.add(water);

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 8), leafLightMat);
      pad.position.set(Math.cos(angle) * 1.5, 0.44, Math.sin(angle) * 1.5);
      pondGroup.add(pad);

      const flowerMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        emissive: new THREE.Color(0xf43f5e),
        emissiveIntensity: 0,
      });
      emissiveMaterials.push({ mat: flowerMat, baseEmissive: new THREE.Color(0xf43f5e), maxIntensity: 0.9 });

      const flower = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.35, 6), flowerMat);
      flower.position.set(Math.cos(angle) * 1.5, 0.6, Math.sin(angle) * 1.5);
      pondGroup.add(flower);
    }

    // Pond Underwater Glow at Night
    const pondLight = new THREE.PointLight(0x2dd4bf, 0, 8, 2);
    pondLight.position.set(0, 0.6, 0);
    pondGroup.add(pondLight);
    nightLights.push({ light: pondLight, baseIntensity: 1.5 });

    group.add(pondGroup);
    interactables.push({
      id: 'crystal_lotus',
      name: 'Moonlight Lotus Pond',
      type: 'Water Feature',
      description: 'Serene reflective water with radiant blossoming lilies.',
      level: 1,
      tier: 2,
      mesh: pondGroup,
    });
  }

  // 5. Harmonic Sakura Grove (Stage 3+)
  if (growthStage >= 3) {
    const sakuraGroup = new THREE.Group();
    sakuraGroup.position.set(6, 0, -4);

    const sTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 4, 8), woodMat);
    sTrunk.position.y = 2;
    sTrunk.rotation.z = -0.15;
    sTrunk.castShadow = true;
    sakuraGroup.add(sTrunk);

    const sFoliage = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4, 1), sakuraMat);
    sFoliage.position.set(-0.4, 4.2, 0);
    sFoliage.castShadow = true;
    sakuraGroup.add(sFoliage);

    group.add(sakuraGroup);
    interactables.push({
      id: 'sakura_shrine',
      name: 'Harmonic Sakura Grove',
      type: 'Sacred Flora',
      description: 'Pink blossoms swirling on gentle updrafts of positive energy.',
      level: 1,
      tier: 3,
      mesh: sakuraGroup,
    });
  }

  // 6. Zen Herb Garden Bed (Stage 1+)
  const herbGroup = new THREE.Group();
  herbGroup.position.set(6, 0, 4);

  const herbBox = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2.5), woodMat);
  herbBox.position.y = 0.25;
  herbBox.castShadow = true;
  herbGroup.add(herbBox);

  for (let x = -1.2; x <= 1.2; x += 0.8) {
    for (let z = -0.6; z <= 0.6; z += 0.6) {
      const plant = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 6), leafLightMat);
      plant.position.set(x, 0.6, z);
      plant.castShadow = true;
      herbGroup.add(plant);
    }
  }

  group.add(herbGroup);
  interactables.push({
    id: 'sprout_bed',
    name: 'Zen Herb Bed',
    type: 'Cultivation Nursery',
    description: 'Nurtured daily with mindful hydration and morning sunlight.',
    level: 1,
    tier: 1,
    mesh: herbGroup,
  });

  // 7. Physical Pathway Lantern Bollards with Point Lights
  const lanternPositions = [
    { x: 1.8, z: 2.5 },
    { x: -1.8, z: 2.5 },
    { x: 1.8, z: 8.5 },
    { x: -1.8, z: 8.5 },
    { x: -5.0, z: 1.6 },
    { x: 4.5, z: 1.6 },
  ];

  lanternPositions.forEach((pos) => {
    const lGroup = new THREE.Group();
    lGroup.position.set(pos.x, 0, pos.z);

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.5), stoneMat);
    base.position.y = 0.12;
    lGroup.add(base);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.4, 6), woodMat);
    post.position.y = 0.8;
    lGroup.add(post);

    const lanternHousingMat = new THREE.MeshStandardMaterial({
      color: 0x44403c,
      emissive: new THREE.Color(0xfef08a),
      emissiveIntensity: 0,
      roughness: 0.3,
    });
    emissiveMaterials.push({ mat: lanternHousingMat, baseEmissive: new THREE.Color(0xfef08a), maxIntensity: 1.2 });

    const glassCore = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.4), lanternHousingMat);
    glassCore.position.y = 1.6;
    lGroup.add(glassCore);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.3, 4), stoneMat);
    roof.position.y = 1.95;
    roof.rotation.y = Math.PI / 4;
    lGroup.add(roof);

    // Physical Warm Point Light casting light onto the ground path
    const pLight = new THREE.PointLight(0xfef08a, 0, 8, 2);
    pLight.position.set(0, 1.6, 0);
    lGroup.add(pLight);
    nightLights.push({ light: pLight, baseIntensity: 1.6 });

    group.add(lGroup);
  });

  // 8. Animated Fluttering Fireflies / Butterflies
  const fireflyGeo = new THREE.BufferGeometry();
  const particleCount = 28;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 18;
    positions[i + 1] = 0.8 + Math.random() * 4;
    positions[i + 2] = (Math.random() - 0.5) * 18;
  }
  fireflyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const fireflyMat = new THREE.PointsMaterial({ color: 0xa7f3d0, size: 0.3, transparent: true, opacity: 0.9 });
  const fireflyParticles = new THREE.Points(fireflyGeo, fireflyMat);
  group.add(fireflyParticles);

  let time = 0;

  return {
    update: (delta: number, isNight: boolean, nightFactor: number) => {
      time += delta;
      foliage1.rotation.y = Math.sin(time * 0.5) * 0.05;
      foliage2.rotation.y = Math.cos(time * 0.6) * 0.06;

      // Adjust physical light intensities based on smooth night factor
      nightLights.forEach(({ light, baseIntensity }) => {
        light.intensity = THREE.MathUtils.lerp(0, baseIntensity, nightFactor);
      });

      emissiveMaterials.forEach(({ mat, baseEmissive, maxIntensity }) => {
        if ('emissive' in mat) {
          (mat as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.lerp(0, maxIntensity, nightFactor);
        }
      });

      // Firefly / butterfly drift
      const pos = fireflyGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        pos[i] += Math.sin(time + i) * 0.02;
        pos[i + 1] += Math.cos(time * 1.5 + i) * 0.015;
        pos[i + 2] += Math.cos(time + i) * 0.02;
      }
      fireflyGeo.attributes.position.needsUpdate = true;
    },
    interactables,
  };
}

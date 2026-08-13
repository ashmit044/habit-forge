import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildMilitary3DScene(
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
  const emissiveMaterials: { mat: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial; maxIntensity: number }[] = [];

  // Refined Materials with proper diffuse scatter (preventing dark silhouette absorption)
  const tarmacMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.75 });
  const armorMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.4 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.5 });
  const hazardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });

  // 1. Tactical Tarmac Baseplate
  const baseplateGeo = new THREE.CylinderGeometry(24, 25, 1.2, 32);
  const baseplate = new THREE.Mesh(baseplateGeo, tarmacMat);
  baseplate.position.y = -0.6;
  baseplate.receiveShadow = true;
  group.add(baseplate);

  // Runway & Taxiway Markings
  const runway = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.04, 22), darkMetalMat);
  runway.position.set(0, 0.02, 0);
  runway.receiveShadow = true;
  group.add(runway);

  const line1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 18), hazardMat);
  line1.position.set(-1.8, 0.03, 0);
  group.add(line1);

  const line2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.05, 18), hazardMat);
  line2.position.set(1.8, 0.03, 0);
  group.add(line2);

  // Helper: Create warm illuminated windows
  const createBunkerWindow = (w: number, h: number, maxGlow = 2.4) => {
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: new THREE.Color(0xfde047),
      emissiveIntensity: 0,
      roughness: 0.2,
    });
    emissiveMaterials.push({ mat: winMat, maxIntensity: maxGlow });
    const winMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), winMat);
    return winMesh;
  };

  // 2. Command Headquarters & Operations Bunker (Main Building)
  const bunkerGroup = new THREE.Group();
  bunkerGroup.position.set(0, 0, -6);

  const bunkerScale = growthStage >= 5 ? 1.3 : 1.0;
  const bunkerBase = new THREE.Mesh(new THREE.BoxGeometry(7.5 * bunkerScale, 3.5 * bunkerScale, 5.0 * bunkerScale), concreteMat);
  bunkerBase.position.y = 1.75 * bunkerScale;
  bunkerBase.castShadow = true;
  bunkerBase.receiveShadow = true;
  bunkerGroup.add(bunkerBase);

  // Upper Command Bridge Deck
  const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(5.2 * bunkerScale, 2.2 * bunkerScale, 3.6 * bunkerScale), armorMat);
  bridgeDeck.position.y = 4.2 * bunkerScale;
  bridgeDeck.castShadow = true;
  bridgeDeck.receiveShadow = true;
  bunkerGroup.add(bridgeDeck);

  // Upper Command Windows (Warm Interior Activity)
  const bridgeWinFront = createBunkerWindow(3.8 * bunkerScale, 0.8 * bunkerScale, 2.6);
  bridgeWinFront.position.set(0, 4.3 * bunkerScale, 1.82 * bunkerScale);
  bunkerGroup.add(bridgeWinFront);

  const bridgeWinLeft = createBunkerWindow(2.2 * bunkerScale, 0.8 * bunkerScale, 2.0);
  bridgeWinLeft.position.set(-2.62 * bunkerScale, 4.3 * bunkerScale, 0);
  bridgeWinLeft.rotation.y = -Math.PI / 2;
  bunkerGroup.add(bridgeWinLeft);

  const bridgeWinRight = createBunkerWindow(2.2 * bunkerScale, 0.8 * bunkerScale, 2.0);
  bridgeWinRight.position.set(2.62 * bunkerScale, 4.3 * bunkerScale, 0);
  bridgeWinRight.rotation.y = Math.PI / 2;
  bunkerGroup.add(bridgeWinRight);

  // Lower Level Entry Blast Doors
  const blastDoor = new THREE.Mesh(new THREE.BoxGeometry(2.4 * bunkerScale, 2.2 * bunkerScale, 0.2), darkMetalMat);
  blastDoor.position.set(0, 1.1 * bunkerScale, 2.52 * bunkerScale);
  bunkerGroup.add(blastDoor);

  // Main Entrance Overhang Canopy
  const entranceCanopy = new THREE.Mesh(new THREE.BoxGeometry(3.6 * bunkerScale, 0.3 * bunkerScale, 1.6 * bunkerScale), armorMat);
  entranceCanopy.position.set(0, 2.5 * bunkerScale, 3.2 * bunkerScale);
  entranceCanopy.castShadow = true;
  bunkerGroup.add(entranceCanopy);

  // High-Lumen Main Entrance Halogen Sconce Lights
  const entranceLightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: new THREE.Color(0xffedd5),
    emissiveIntensity: 0,
  });
  emissiveMaterials.push({ mat: entranceLightMat, maxIntensity: 2.8 });

  const entranceSconce = new THREE.Mesh(new THREE.BoxGeometry(2.4 * bunkerScale, 0.15, 0.4), entranceLightMat);
  entranceSconce.position.set(0, 2.35 * bunkerScale, 3.2 * bunkerScale);
  bunkerGroup.add(entranceSconce);

  const entranceLight = new THREE.PointLight(0xffedd5, 0, 14, 2);
  entranceLight.position.set(0, 2.2 * bunkerScale, 3.6 * bunkerScale);
  bunkerGroup.add(entranceLight);
  nightLights.push({ light: entranceLight, baseIntensity: 3.2 });

  // Facade Wall-Washer Uplights (Illuminates concrete facade)
  const leftUplight = new THREE.PointLight(0x93c5fd, 0, 10, 2);
  leftUplight.position.set(-3.2 * bunkerScale, 0.4, 2.8 * bunkerScale);
  bunkerGroup.add(leftUplight);
  nightLights.push({ light: leftUplight, baseIntensity: 2.4 });

  const rightUplight = new THREE.PointLight(0x93c5fd, 0, 10, 2);
  rightUplight.position.set(3.2 * bunkerScale, 0.4, 2.8 * bunkerScale);
  bunkerGroup.add(rightUplight);
  nightLights.push({ light: rightUplight, baseIntensity: 2.4 });

  group.add(bunkerGroup);
  interactables.push({
    id: 'command_hq',
    name: 'Aegis Command Citadel',
    type: 'Operations Headquarters',
    description: 'Central operations bunker coordinating tactical defenses and daily habit missions.',
    level: growthStage,
    tier: 5,
    mesh: bunkerGroup,
  });

  // 3. Central Titan War Mech & Gantry Rig
  const mechGroup = new THREE.Group();
  mechGroup.position.set(0, 0, 0);

  const legGeo = new THREE.BoxGeometry(0.9, 3, 1.3);
  const leftLeg = new THREE.Mesh(legGeo, armorMat);
  leftLeg.position.set(-1.3, 1.5, 0);
  leftLeg.castShadow = true;
  mechGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, armorMat);
  rightLeg.position.set(1.3, 1.5, 0);
  rightLeg.castShadow = true;
  mechGroup.add(rightLeg);

  const footGeo = new THREE.BoxGeometry(1.3, 0.4, 2.2);
  const leftFoot = new THREE.Mesh(footGeo, darkMetalMat);
  leftFoot.position.set(-1.3, 0.2, 0.3);
  leftFoot.castShadow = true;
  mechGroup.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, darkMetalMat);
  rightFoot.position.set(1.3, 0.2, 0.3);
  rightFoot.castShadow = true;
  mechGroup.add(rightFoot);

  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.8), darkMetalMat);
  pelvis.position.y = 3.2;
  pelvis.castShadow = true;
  mechGroup.add(pelvis);

  const torsoScale = growthStage >= 5 ? 1.3 : 1.0;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(3.8 * torsoScale, 2.5 * torsoScale, 2.5 * torsoScale), armorMat);
  torso.position.y = 4.8;
  torso.castShadow = true;
  mechGroup.add(torso);

  // Visor Cockpit HUD (Warm & Glowing)
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: new THREE.Color(0x38bdf8),
    emissiveIntensity: 0.8,
  });
  emissiveMaterials.push({ mat: visorMat, maxIntensity: 2.5 });

  const visor = new THREE.Mesh(new THREE.BoxGeometry(2.0 * torsoScale, 0.4 * torsoScale, 0.3), visorMat);
  visor.position.set(0, 5.2, 1.35 * torsoScale);
  mechGroup.add(visor);

  // Core Glowing Reactor
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: new THREE.Color(0x38bdf8),
    emissiveIntensity: 0.8,
  });
  emissiveMaterials.push({ mat: coreMat, maxIntensity: 2.6 });

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.25, 12), coreMat);
  core.rotation.x = Math.PI / 2;
  core.position.set(0, 4.4, 1.3 * torsoScale);
  mechGroup.add(core);

  // Dual Gantry High-Power Spotlights (Aimed at Titan Mech)
  const leftGantryLight = new THREE.PointLight(0xffedd5, 0, 16, 2);
  leftGantryLight.position.set(-3.5, 4.5, 2.8);
  mechGroup.add(leftGantryLight);
  nightLights.push({ light: leftGantryLight, baseIntensity: 3.2 });

  const rightGantryLight = new THREE.PointLight(0xffedd5, 0, 16, 2);
  rightGantryLight.position.set(3.5, 4.5, 2.8);
  mechGroup.add(rightGantryLight);
  nightLights.push({ light: rightGantryLight, baseIntensity: 3.2 });

  // Low Ground Uplight
  const mechUplight = new THREE.PointLight(0x38bdf8, 0, 12, 2);
  mechUplight.position.set(0, 0.6, 3.2);
  mechGroup.add(mechUplight);
  nightLights.push({ light: mechUplight, baseIntensity: 2.2 });

  if (growthStage >= 3) {
    const leftPod = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 2.2), darkMetalMat);
    leftPod.position.set(-2.9, 6.2, 0);
    leftPod.castShadow = true;
    mechGroup.add(leftPod);

    const rightPod = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 2.2), darkMetalMat);
    rightPod.position.set(2.9, 6.2, 0);
    rightPod.castShadow = true;
    mechGroup.add(rightPod);
  }

  if (growthStage >= 4) {
    const leftCannon = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4.2, 8), darkMetalMat);
    leftCannon.rotation.x = Math.PI / 2;
    leftCannon.position.set(-2.8, 4.5, 1.8);
    leftCannon.castShadow = true;
    mechGroup.add(leftCannon);

    const rightCannon = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4.2, 8), darkMetalMat);
    rightCannon.rotation.x = Math.PI / 2;
    rightCannon.position.set(2.8, 4.5, 1.8);
    rightCannon.castShadow = true;
    mechGroup.add(rightCannon);
  }

  group.add(mechGroup);
  interactables.push({
    id: 'titan_mech',
    name: 'Aegis-IV Titan Mech',
    type: 'Heavy War Asset',
    description: 'Heavy mechanized armor platform powered by daily workout discipline.',
    level: growthStage,
    tier: 5,
    mesh: mechGroup,
  });

  // 4. Phased Array Radar Dish Tower
  const radarGroup = new THREE.Group();
  radarGroup.position.set(7, 0, -3);

  const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.3, 5.5, 8), armorMat);
  pylon.position.y = 2.75;
  pylon.castShadow = true;
  radarGroup.add(pylon);

  const dishGroup = new THREE.Group();
  dishGroup.position.y = 5.6;

  const dish = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 0.4, 0.45, 16), armorMat);
  dish.rotation.x = Math.PI / 3;
  dish.castShadow = true;
  dishGroup.add(dish);

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: new THREE.Color(0xef4444),
    emissiveIntensity: 0.4,
  });
  emissiveMaterials.push({ mat: beaconMat, maxIntensity: 2.5 });

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), beaconMat);
  beacon.position.set(0, 1.3, 0.7);
  dishGroup.add(beacon);

  const beaconLight = new THREE.PointLight(0xef4444, 0, 8, 2);
  beaconLight.position.set(0, 1.3, 0.7);
  dishGroup.add(beaconLight);
  nightLights.push({ light: beaconLight, baseIntensity: 1.8 });

  // Radar Platform Warm Service Light
  const radarServiceLight = new THREE.PointLight(0xfef08a, 0, 10, 2);
  radarServiceLight.position.set(0, 2.5, 1.2);
  radarGroup.add(radarServiceLight);
  nightLights.push({ light: radarServiceLight, baseIntensity: 2.2 });

  radarGroup.add(dishGroup);
  group.add(radarGroup);
  interactables.push({
    id: 'radar_dish',
    name: 'Phased Array Radar',
    type: 'Recon Telemetry',
    description: 'Scans for long-range targets and scheduled daily habits.',
    level: 1,
    tier: 2,
    mesh: radarGroup,
  });

  // 5. Perimeter Laser Sentry Turret with Sentry Lamp
  const sentryGroup = new THREE.Group();
  sentryGroup.position.set(-6.5, 0, 4);

  const sBase = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 1.3, 8), armorMat);
  sBase.position.y = 0.65;
  sBase.castShadow = true;
  sentryGroup.add(sBase);

  const sHead = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 1.7), darkMetalMat);
  sHead.position.y = 1.7;
  sHead.castShadow = true;
  sentryGroup.add(sHead);

  const sBarrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8, 6), darkMetalMat);
  sBarrel1.rotation.x = Math.PI / 2;
  sBarrel1.position.set(-0.4, 1.7, 1.2);
  sentryGroup.add(sBarrel1);

  const sBarrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.8, 6), darkMetalMat);
  sBarrel2.rotation.x = Math.PI / 2;
  sBarrel2.position.set(0.4, 1.7, 1.2);
  sentryGroup.add(sBarrel2);

  // Sentry target searchlight
  const sentryLight = new THREE.PointLight(0x38bdf8, 0, 10, 2);
  sentryLight.position.set(0, 1.8, 1.5);
  sentryGroup.add(sentryLight);
  nightLights.push({ light: sentryLight, baseIntensity: 2.2 });

  group.add(sentryGroup);
  interactables.push({
    id: 'sentry_turret',
    name: 'Twin-Link Laser Sentry',
    type: 'Perimeter Defense',
    description: 'Automated laser turret defending against procrastination breaches.',
    level: 1,
    tier: 1,
    mesh: sentryGroup,
  });

  // 6. Heavy Combat Tank
  if (growthStage >= 4) {
    const tankGroup = new THREE.Group();
    tankGroup.position.set(-6, 0, -4);

    const tTracks = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.9, 2.9), darkMetalMat);
    tTracks.position.y = 0.45;
    tTracks.castShadow = true;
    tankGroup.add(tTracks);

    const tHull = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.1, 2.5), armorMat);
    tHull.position.y = 1.2;
    tHull.castShadow = true;
    tankGroup.add(tHull);

    const tTurret = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 0.85, 8), darkMetalMat);
    tTurret.position.y = 2.0;
    tTurret.castShadow = true;
    tankGroup.add(tTurret);

    const tGun = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 3.4, 8), darkMetalMat);
    tGun.rotation.x = Math.PI / 2;
    tGun.position.set(0, 2.1, 2.1);
    tGun.castShadow = true;
    tankGroup.add(tGun);

    // Tank Headlights
    const tankLight = new THREE.PointLight(0xffedd5, 0, 12, 2);
    tankLight.position.set(0, 1.4, 2.6);
    tankGroup.add(tankLight);
    nightLights.push({ light: tankLight, baseIntensity: 2.4 });

    group.add(tankGroup);
  }

  // 7. Perimeter Stadium Floodlights (High-Powered Warm Halogen Towers)
  const floodlightPositions = [
    { x: -9.5, z: -8.5 },
    { x: 9.5, z: -8.5 },
    { x: -9.5, z: 8.5 },
    { x: 9.5, z: 8.5 },
  ];

  floodlightPositions.forEach((pos) => {
    const fGroup = new THREE.Group();
    fGroup.position.set(pos.x, 0, pos.z);

    const fPole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 6.5, 8), armorMat);
    fPole.position.y = 3.25;
    fPole.castShadow = true;
    fGroup.add(fPole);

    const fHead = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.7), darkMetalMat);
    fHead.position.set(0, 6.6, 0);
    fHead.rotation.x = Math.PI / 5;
    fGroup.add(fHead);

    const fBulbMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0xffedd5),
      emissiveIntensity: 0,
    });
    emissiveMaterials.push({ mat: fBulbMat, maxIntensity: 3.0 });

    const fBulb = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.15, 0.5), fBulbMat);
    fBulb.position.set(0, 6.5, 0.15);
    fGroup.add(fBulb);

    // High-Intensity stadium floodlight casting soft wide pool across the tarmac
    const floodLight = new THREE.PointLight(0xffedd5, 0, 22, 2);
    floodLight.position.set(0, 6.4, 0.6);
    fGroup.add(floodLight);
    nightLights.push({ light: floodLight, baseIntensity: 3.6 });

    group.add(fGroup);
  });

  // 8. Runway & Pathway Inset Marker Lights
  const runwayMarkerPositions = [
    { x: -2.0, z: 6 },
    { x: 2.0, z: 6 },
    { x: -2.0, z: -2 },
    { x: 2.0, z: -2 },
  ];

  runwayMarkerPositions.forEach((pos) => {
    const rLight = new THREE.PointLight(0xfde047, 0, 7, 2);
    rLight.position.set(pos.x, 0.25, pos.z);
    group.add(rLight);
    nightLights.push({ light: rLight, baseIntensity: 1.5 });
  });

  // 9. Base Central Ambient Fill Light (Eliminates pitch-black silhouette in night mode)
  const baseFillLight = new THREE.PointLight(0x94a3b8, 0, 28, 1.8);
  baseFillLight.position.set(0, 8, 0);
  group.add(baseFillLight);
  nightLights.push({ light: baseFillLight, baseIntensity: 1.6 });

  // 10. Autonomous Hover Drone
  const droneGroup = new THREE.Group();
  droneGroup.position.set(2, 4, 3);

  const dBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 1.3), armorMat);
  dBody.castShadow = true;
  droneGroup.add(dBody);

  const dNavLightMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: new THREE.Color(0x38bdf8),
    emissiveIntensity: 0.5,
  });
  emissiveMaterials.push({ mat: dNavLightMat, maxIntensity: 2.2 });

  const dCore = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), dNavLightMat);
  dCore.position.y = 0.18;
  droneGroup.add(dCore);

  group.add(droneGroup);
  interactables.push({
    id: 'drone_bay',
    name: 'Sky-Eye Recon Drone',
    type: 'Air Recon',
    description: 'Nimble autonomous UAV patrolling your daily goals.',
    level: 1,
    tier: 3,
    mesh: droneGroup,
  });

  let time = 0;

  return {
    update: (delta: number, isNight: boolean, nightFactor: number) => {
      time += delta;
      dishGroup.rotation.y += delta * 1.2;

      sHead.rotation.y = Math.sin(time * 0.8) * 0.4;
      sBarrel1.rotation.y = Math.sin(time * 0.8) * 0.4;
      sBarrel2.rotation.y = Math.sin(time * 0.8) * 0.4;

      mechGroup.position.y = Math.sin(time * 1.2) * 0.06;

      droneGroup.position.x = Math.sin(time * 0.7) * 5.5;
      droneGroup.position.z = Math.cos(time * 0.7) * 5.5;
      droneGroup.position.y = 4.2 + Math.sin(time * 2.0) * 0.3;
      droneGroup.rotation.y = -time * 0.7 + Math.PI / 2;

      // Obstruction beacon rhythmic pulse at night
      const beaconPulse = Math.sin(time * 3) > 0 ? 1 : 0.2;
      beaconLight.intensity = nightFactor * 2.0 * beaconPulse;

      nightLights.forEach(({ light, baseIntensity }) => {
        if (light !== beaconLight) {
          light.intensity = THREE.MathUtils.lerp(0, baseIntensity, nightFactor);
        }
      });

      emissiveMaterials.forEach(({ mat, maxIntensity }) => {
        if ('emissive' in mat) {
          (mat as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.lerp(0, maxIntensity, nightFactor);
        }
      });
    },
    interactables,
  };
}

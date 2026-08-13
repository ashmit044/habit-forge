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

  // Materials
  const tarmacMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const armorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.7 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.8 });
  const hazardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });

  // 1. Tactical Tarmac Baseplate
  const baseplateGeo = new THREE.CylinderGeometry(24, 25, 1.2, 32);
  const baseplate = new THREE.Mesh(baseplateGeo, tarmacMat);
  baseplate.position.y = -0.6;
  baseplate.receiveShadow = true;
  group.add(baseplate);

  // Runway Markings
  const runway = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 22), darkMetalMat);
  runway.position.set(0, 0.02, 0);
  runway.receiveShadow = true;
  group.add(runway);

  const line1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 18), hazardMat);
  line1.position.set(-1.6, 0.03, 0);
  group.add(line1);

  const line2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 18), hazardMat);
  line2.position.set(1.6, 0.03, 0);
  group.add(line2);

  // 2. Central Titan War Mech
  const mechGroup = new THREE.Group();
  mechGroup.position.set(0, 0, -2);

  const legGeo = new THREE.BoxGeometry(0.8, 3, 1.2);
  const leftLeg = new THREE.Mesh(legGeo, armorMat);
  leftLeg.position.set(-1.2, 1.5, 0);
  leftLeg.castShadow = true;
  mechGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, armorMat);
  rightLeg.position.set(1.2, 1.5, 0);
  rightLeg.castShadow = true;
  mechGroup.add(rightLeg);

  const footGeo = new THREE.BoxGeometry(1.2, 0.4, 2);
  const leftFoot = new THREE.Mesh(footGeo, darkMetalMat);
  leftFoot.position.set(-1.2, 0.2, 0.3);
  leftFoot.castShadow = true;
  mechGroup.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, darkMetalMat);
  rightFoot.position.set(1.2, 0.2, 0.3);
  rightFoot.castShadow = true;
  mechGroup.add(rightFoot);

  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 1.6), darkMetalMat);
  pelvis.position.y = 3.2;
  pelvis.castShadow = true;
  mechGroup.add(pelvis);

  const torsoScale = growthStage >= 5 ? 1.3 : 1.0;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(3.6 * torsoScale, 2.4 * torsoScale, 2.4 * torsoScale), armorMat);
  torso.position.y = 4.8;
  torso.castShadow = true;
  mechGroup.add(torso);

  // Core Glowing Reactor (Emissive material with soft glow)
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    emissive: new THREE.Color(0x38bdf8),
    emissiveIntensity: 0.5,
    roughness: 0.2,
  });
  emissiveMaterials.push({ mat: coreMat, maxIntensity: 2.0 });

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 12), coreMat);
  core.rotation.x = Math.PI / 2;
  core.position.set(0, 4.8, 1.3 * torsoScale);
  mechGroup.add(core);

  // Mech Gantry Ground Uplight (Casts dramatic upward shadow at night)
  const mechUplight = new THREE.PointLight(0x38bdf8, 0, 10, 2);
  mechUplight.position.set(0, 0.4, 3.5);
  mechGroup.add(mechUplight);
  nightLights.push({ light: mechUplight, baseIntensity: 1.8 });

  if (growthStage >= 3) {
    const leftPod = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 2), darkMetalMat);
    leftPod.position.set(-2.8, 6.2, 0);
    leftPod.castShadow = true;
    mechGroup.add(leftPod);

    const rightPod = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 2), darkMetalMat);
    rightPod.position.set(2.8, 6.2, 0);
    rightPod.castShadow = true;
    mechGroup.add(rightPod);
  }

  if (growthStage >= 4) {
    const leftCannon = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4, 8), darkMetalMat);
    leftCannon.rotation.x = Math.PI / 2;
    leftCannon.position.set(-2.6, 4.5, 1.6);
    leftCannon.castShadow = true;
    mechGroup.add(leftCannon);

    const rightCannon = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 4, 8), darkMetalMat);
    rightCannon.rotation.x = Math.PI / 2;
    rightCannon.position.set(2.6, 4.5, 1.6);
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

  // 3. Phased Array Radar Dish Tower with Obstruction Beacon
  const radarGroup = new THREE.Group();
  radarGroup.position.set(7, 0, -4);

  const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.2, 5, 8), darkMetalMat);
  pylon.position.y = 2.5;
  pylon.castShadow = true;
  radarGroup.add(pylon);

  const dishGroup = new THREE.Group();
  dishGroup.position.y = 5.2;

  const dish = new THREE.Mesh(new THREE.CylinderGeometry(2, 0.3, 0.4, 16), armorMat);
  dish.rotation.x = Math.PI / 3;
  dish.castShadow = true;
  dishGroup.add(dish);

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: new THREE.Color(0xef4444),
    emissiveIntensity: 0.2,
  });
  emissiveMaterials.push({ mat: beaconMat, maxIntensity: 2.2 });

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), beaconMat);
  beacon.position.set(0, 1.2, 0.6);
  dishGroup.add(beacon);

  // Beacon point light
  const beaconLight = new THREE.PointLight(0xef4444, 0, 6, 2);
  beaconLight.position.set(0, 1.2, 0.6);
  dishGroup.add(beaconLight);
  nightLights.push({ light: beaconLight, baseIntensity: 1.2 });

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

  // 4. Perimeter Laser Sentry Turret
  const sentryGroup = new THREE.Group();
  sentryGroup.position.set(-6, 0, 4);

  const sBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 1.2, 8), armorMat);
  sBase.position.y = 0.6;
  sBase.castShadow = true;
  sentryGroup.add(sBase);

  const sHead = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 1.6), darkMetalMat);
  sHead.position.y = 1.6;
  sHead.castShadow = true;
  sentryGroup.add(sHead);

  const sBarrel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 6), darkMetalMat);
  sBarrel1.rotation.x = Math.PI / 2;
  sBarrel1.position.set(-0.35, 1.6, 1.1);
  sentryGroup.add(sBarrel1);

  const sBarrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 6), darkMetalMat);
  sBarrel2.rotation.x = Math.PI / 2;
  sBarrel2.position.set(0.35, 1.6, 1.1);
  sentryGroup.add(sBarrel2);

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

  // 5. Heavy Combat Tank
  if (growthStage >= 4) {
    const tankGroup = new THREE.Group();
    tankGroup.position.set(-6, 0, -4);

    const tTracks = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 2.8), darkMetalMat);
    tTracks.position.y = 0.4;
    tTracks.castShadow = true;
    tankGroup.add(tTracks);

    const tHull = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.0, 2.4), armorMat);
    tHull.position.y = 1.1;
    tHull.castShadow = true;
    tankGroup.add(tHull);

    const tTurret = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 0.8, 8), darkMetalMat);
    tTurret.position.y = 1.9;
    tTurret.castShadow = true;
    tankGroup.add(tTurret);

    const tGun = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 3.2, 8), darkMetalMat);
    tGun.rotation.x = Math.PI / 2;
    tGun.position.set(0, 2.0, 2.0);
    tGun.castShadow = true;
    tankGroup.add(tGun);

    group.add(tankGroup);
  }

  // 6. Perimeter Stadium Floodlights (Real 3D Streetlights/Pylons)
  const floodlightPositions = [
    { x: -9, z: -8 },
    { x: 9, z: -8 },
    { x: -9, z: 8 },
    { x: 9, z: 8 },
  ];

  floodlightPositions.forEach((pos) => {
    const fGroup = new THREE.Group();
    fGroup.position.set(pos.x, 0, pos.z);

    const fPole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 6, 8), darkMetalMat);
    fPole.position.y = 3;
    fPole.castShadow = true;
    fGroup.add(fPole);

    const fHead = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.6), darkMetalMat);
    fHead.position.set(0, 6, 0);
    fHead.rotation.x = Math.PI / 6;
    fGroup.add(fHead);

    const fBulbMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0xffedd5),
      emissiveIntensity: 0,
    });
    emissiveMaterials.push({ mat: fBulbMat, maxIntensity: 2.5 });

    const fBulb = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.4), fBulbMat);
    fBulb.position.set(0, 5.9, 0.1);
    fGroup.add(fBulb);

    const floodLight = new THREE.PointLight(0xffedd5, 0, 16, 2);
    floodLight.position.set(0, 5.8, 0.5);
    fGroup.add(floodLight);
    nightLights.push({ light: floodLight, baseIntensity: 2.2 });

    group.add(fGroup);
  });

  // 7. Autonomous Hover Drone
  const droneGroup = new THREE.Group();
  droneGroup.position.set(2, 4, 3);

  const dBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), darkMetalMat);
  dBody.castShadow = true;
  droneGroup.add(dBody);

  const dNavLightMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: new THREE.Color(0x38bdf8),
    emissiveIntensity: 0.5,
  });
  emissiveMaterials.push({ mat: dNavLightMat, maxIntensity: 2.0 });

  const dCore = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), dNavLightMat);
  dCore.position.y = 0.15;
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

      droneGroup.position.x = Math.sin(time * 0.7) * 5;
      droneGroup.position.z = Math.cos(time * 0.7) * 5;
      droneGroup.position.y = 4.2 + Math.sin(time * 2.0) * 0.3;
      droneGroup.rotation.y = -time * 0.7 + Math.PI / 2;

      // Obstruction beacon rhythmic pulse at night
      const beaconPulse = Math.sin(time * 3) > 0 ? 1 : 0.2;
      beaconLight.intensity = nightFactor * 1.5 * beaconPulse;

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

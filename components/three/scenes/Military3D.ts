import * as THREE from 'three';
import { Interactive3DObject } from './Garden3D';

export function buildMilitary3DScene(
  scene: THREE.Scene,
  growthStage: number
): { update: (delta: number) => void; interactables: Interactive3DObject[] } {
  const group = new THREE.Group();
  scene.add(group);

  const interactables: Interactive3DObject[] = [];

  // Materials
  const tarmacMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const armorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const hazardMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });
  const glowBlueMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const glowRedMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

  // 1. Tactical Tarmac Baseplate
  const baseplateGeo = new THREE.CylinderGeometry(24, 25, 1.2, 32);
  const baseplate = new THREE.Mesh(baseplateGeo, tarmacMat);
  baseplate.position.y = -0.6;
  baseplate.receiveShadow = true;
  group.add(baseplate);

  // Runway / Taxiway Markings
  const runway = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 22), darkMetalMat);
  runway.position.set(0, 0.02, 0);
  runway.receiveShadow = true;
  group.add(runway);

  // Hazard Lines
  const line1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 18), hazardMat);
  line1.position.set(-1.6, 0.03, 0);
  group.add(line1);

  const line2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 18), hazardMat);
  line2.position.set(1.6, 0.03, 0);
  group.add(line2);

  // 2. Central Titan War Mech (Stage 1 to 5)
  const mechGroup = new THREE.Group();
  mechGroup.position.set(0, 0, -2);

  // Bipedal Legs
  const legGeo = new THREE.BoxGeometry(0.8, 3, 1.2);
  const leftLeg = new THREE.Mesh(legGeo, armorMat);
  leftLeg.position.set(-1.2, 1.5, 0);
  leftLeg.castShadow = true;
  mechGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, armorMat);
  rightLeg.position.set(1.2, 1.5, 0);
  rightLeg.castShadow = true;
  mechGroup.add(rightLeg);

  // Feet
  const footGeo = new THREE.BoxGeometry(1.2, 0.4, 2);
  const leftFoot = new THREE.Mesh(footGeo, darkMetalMat);
  leftFoot.position.set(-1.2, 0.2, 0.3);
  leftFoot.castShadow = true;
  mechGroup.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, darkMetalMat);
  rightFoot.position.set(1.2, 0.2, 0.3);
  rightFoot.castShadow = true;
  mechGroup.add(rightFoot);

  // Pelvis & Torso
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 1.6), darkMetalMat);
  pelvis.position.y = 3.2;
  pelvis.castShadow = true;
  mechGroup.add(pelvis);

  const torsoScale = growthStage >= 5 ? 1.3 : 1.0;
  const torso = new THREE.Mesh(new THREE.BoxGeometry(3.6 * torsoScale, 2.4 * torsoScale, 2.4 * torsoScale), armorMat);
  torso.position.y = 4.8;
  torso.castShadow = true;
  mechGroup.add(torso);

  // Glowing Core Reactor
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 12), glowBlueMat);
  core.rotation.x = Math.PI / 2;
  core.position.set(0, 4.8, 1.3 * torsoScale);
  mechGroup.add(core);

  // Shoulder Mounted Missile Pods (Stage 3+)
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

  // Arm Cannons (Stage 4+)
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

  // 3. Phased Array Radar Dish Tower (Stage 2+)
  const radarGroup = new THREE.Group();
  radarGroup.position.set(7, 0, -4);

  // Tower Pylon
  const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.2, 5, 8), darkMetalMat);
  pylon.position.y = 2.5;
  pylon.castShadow = true;
  radarGroup.add(pylon);

  // Rotating Dish Assembly
  const dishGroup = new THREE.Group();
  dishGroup.position.y = 5.2;

  const dish = new THREE.Mesh(new THREE.CylinderGeometry(2, 0.3, 0.4, 16), armorMat);
  dish.rotation.x = Math.PI / 3;
  dish.castShadow = true;
  dishGroup.add(dish);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.6, 6), glowBlueMat);
  antenna.position.set(0, 0.8, 0.6);
  antenna.rotation.x = Math.PI / 3;
  dishGroup.add(antenna);

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

  // 4. Perimeter Twin-Link Sentry Turrets (Stage 1+)
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

  const sLaser = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), glowRedMat);
  sLaser.position.set(0, 1.8, 0.8);
  sentryGroup.add(sLaser);

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

  // 5. Heavy Combat Tank (Stage 4+)
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

  // 6. Autonomous Hover Drone (Stage 3+)
  const droneGroup = new THREE.Group();
  droneGroup.position.set(2, 4, 3);

  const dBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), darkMetalMat);
  dBody.castShadow = true;
  droneGroup.add(dBody);

  const dCore = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), glowBlueMat);
  dCore.position.y = 0.15;
  droneGroup.add(dCore);

  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2 + Math.PI / 4;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 4), darkMetalMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7);
    arm.rotation.y = angle;
    droneGroup.add(arm);

    const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 6), glowBlueMat);
    rotor.position.set(Math.cos(angle) * 1.1, 0.1, Math.sin(angle) * 1.1);
    droneGroup.add(rotor);
  }

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
    update: (delta: number) => {
      time += delta;
      // Rotate radar dish
      dishGroup.rotation.y += delta * 1.2;

      // Sentry turret slight scan sweep
      sHead.rotation.y = Math.sin(time * 0.8) * 0.4;
      sBarrel1.rotation.y = Math.sin(time * 0.8) * 0.4;
      sBarrel2.rotation.y = Math.sin(time * 0.8) * 0.4;

      // Mech subtle idle breathing
      mechGroup.position.y = Math.sin(time * 1.2) * 0.06;

      // Hover Drone spline movement
      droneGroup.position.x = Math.sin(time * 0.7) * 5;
      droneGroup.position.z = Math.cos(time * 0.7) * 5;
      droneGroup.position.y = 4.2 + Math.sin(time * 2.0) * 0.3;
      droneGroup.rotation.y = -time * 0.7 + Math.PI / 2;
    },
    interactables,
  };
}

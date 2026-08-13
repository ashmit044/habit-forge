'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RealmProgression, RealmType } from '@/lib/types';
import { REALM_DEFINITIONS } from '@/lib/realm-config';
import { buildGarden3DScene, Interactive3DObject } from './scenes/Garden3D';
import { buildMilitary3DScene } from './scenes/Military3D';
import { buildTown3DScene } from './scenes/Town3D';
import { buildSpace3DScene } from './scenes/Space3D';
import { buildArcane3DScene } from './scenes/Arcane3D';
import { soundManager } from '@/lib/sound';
import { RotateCcw, Eye, Sun, Moon, Sparkles, TrendingUp, Layers } from 'lucide-react';

interface ThreeRealmCanvasProps {
  realmProg: RealmProgression;
  onSelectStructure: (obj: Interactive3DObject | null) => void;
  onInteractHarvest?: (realmType: RealmType, gain: number) => void;
}

export const ThreeRealmCanvas: React.FC<ThreeRealmCanvasProps> = ({
  realmProg,
  onSelectStructure,
  onInteractHarvest,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNight, setIsNight] = useState(false);
  const [cameraMode, setCameraMode] = useState<'iso' | 'top' | 'focus'>('iso');
  const [hoveredObjectName, setHoveredObjectName] = useState<string | null>(null);

  const meta = REALM_DEFINITIONS[realmProg.realmType];
  const progressPercent = Math.min(
    100,
    Math.round((realmProg.currentPoints / realmProg.pointsToNextStage) * 100)
  );

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const interactablesRef = useRef<Interactive3DObject[]>([]);
  const targetCamPosRef = useRef(new THREE.Vector3(18, 16, 18));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 2, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 2, 0));

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isNight ? 0x09090b : 0x121216);
    scene.fog = new THREE.FogExp2(isNight ? 0x09090b : 0x121216, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(18, 16, 18);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNight ? 0.7 : 1.1;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(isNight ? 0x1e1b4b : 0xffffff, isNight ? 0.4 : 0.85);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x18181b, isNight ? 0.3 : 0.6);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(isNight ? 0x60a5fa : 0xffedd5, isNight ? 0.8 : 1.8);
    dirLight.position.set(16, 24, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left = -16;
    dirLight.shadow.camera.right = 16;
    dirLight.shadow.camera.top = 16;
    dirLight.shadow.camera.bottom = -16;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // 5. Build Realm 3D Scene
    let sceneController: { update: (delta: number) => void; interactables: Interactive3DObject[] };

    switch (realmProg.realmType) {
      case 'garden':
        sceneController = buildGarden3DScene(scene, realmProg.growthStage);
        break;
      case 'military':
        sceneController = buildMilitary3DScene(scene, realmProg.growthStage);
        break;
      case 'town':
        sceneController = buildTown3DScene(scene, realmProg.growthStage);
        break;
      case 'space':
        sceneController = buildSpace3DScene(scene, realmProg.growthStage);
        break;
      case 'arcane':
        sceneController = buildArcane3DScene(scene, realmProg.growthStage);
        break;
    }

    interactablesRef.current = sceneController.interactables;

    // 6. Simple Mouse Drag Orbit & Raycasting
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = new THREE.Spherical(28, Math.PI / 3.5, Math.PI / 4);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        spherical.theta -= deltaX * 0.006;
        spherical.phi = Math.max(0.2, Math.min(Math.PI / 2.1, spherical.phi - deltaY * 0.006));

        targetCamPosRef.current.setFromSpherical(spherical).add(targetLookAtRef.current);
      } else {
        // Raycast Hover Check
        raycaster.setFromCamera(mouse, camera);
        const meshes: THREE.Object3D[] = [];
        interactablesRef.current.forEach((item) => {
          item.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) meshes.push(child);
          });
        });

        const intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          const matched = interactablesRef.current.find((item) => {
            let found = false;
            item.mesh.traverse((c) => {
              if (c === hitMesh) found = true;
            });
            return found;
          });
          setHoveredObjectName(matched ? matched.name : null);
          container.style.cursor = 'pointer';
        } else {
          setHoveredObjectName(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (isDragging && Math.abs(e.clientX - prevMouseX) < 3 && Math.abs(e.clientY - prevMouseY) < 3) {
        // Raycast Click
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const meshes: THREE.Object3D[] = [];
        interactablesRef.current.forEach((item) => {
          item.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) meshes.push(child);
          });
        });

        const intersects = raycaster.intersectObjects(meshes);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object;
          const matched = interactablesRef.current.find((item) => {
            let found = false;
            item.mesh.traverse((c) => {
              if (c === hitMesh) found = true;
            });
            return found;
          });

          if (matched) {
            soundManager.playHarvest();
            onSelectStructure(matched);
            if (onInteractHarvest) onInteractHarvest(realmProg.realmType, 5);

            // Focus Camera on Selected Structure
            const worldPos = new THREE.Vector3();
            matched.mesh.getWorldPosition(worldPos);
            targetLookAtRef.current.copy(worldPos).add(new THREE.Vector3(0, 1.5, 0));
            targetCamPosRef.current.set(worldPos.x + 8, worldPos.y + 6, worldPos.z + 8);
          }
        } else {
          onSelectStructure(null);
        }
      }
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(12, Math.min(48, spherical.radius + e.deltaY * 0.03));
      targetCamPosRef.current.setFromSpherical(spherical).add(targetLookAtRef.current);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 7. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      sceneController.update(delta);

      // Smooth Camera Lerp
      camera.position.lerp(targetCamPosRef.current, 0.08);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.08);
      camera.lookAt(currentLookAtRef.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [realmProg.realmType, realmProg.growthStage, isNight, onSelectStructure, onInteractHarvest]);

  // Preset Camera Positions
  const setCameraPreset = (mode: 'iso' | 'top' | 'focus') => {
    soundManager.playTap();
    setCameraMode(mode);
    if (mode === 'iso') {
      targetLookAtRef.current.set(0, 2, 0);
      targetCamPosRef.current.set(18, 16, 18);
    } else if (mode === 'top') {
      targetLookAtRef.current.set(0, 0, 0);
      targetCamPosRef.current.set(0.1, 32, 0.1);
    } else if (mode === 'focus') {
      targetLookAtRef.current.set(0, 3, 0);
      targetCamPosRef.current.set(10, 8, 10);
    }
  };

  return (
    <div className="relative w-full h-[360px] md:h-[440px] rounded-xl overflow-hidden studio-panel bg-[#09090b] border border-[#27272a] shadow-lg select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hovered Building Tooltip Badge */}
      {hoveredObjectName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-md bg-[#18181b]/90 border border-[#3f3f46] text-xs font-semibold text-white shadow animate-fadeIn pointer-events-none flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
          <span>{hoveredObjectName} &bull; Click to Inspect</span>
        </div>
      )}

      {/* Camera Controls Overlay (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 p-1 rounded-lg bg-[#121215]/80 border border-[#27272a] backdrop-blur-sm shadow">
        <button
          type="button"
          onClick={() => setCameraPreset('iso')}
          className={`p-1.5 rounded text-xs font-medium transition-colors ${
            cameraMode === 'iso' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'
          }`}
          title="Isometric View"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('top')}
          className={`p-1.5 rounded text-xs font-medium transition-colors ${
            cameraMode === 'top' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'
          }`}
          title="Top-Down Plan View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('focus')}
          className={`p-1.5 rounded text-xs font-medium transition-colors ${
            cameraMode === 'focus' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'
          }`}
          title="Close-Up Focus"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3.5 bg-[#27272a] mx-0.5" />

        <button
          type="button"
          onClick={() => {
            soundManager.playTap();
            setIsNight(!isNight);
          }}
          className="p-1.5 rounded text-xs text-[#a1a1aa] hover:text-white transition-colors"
          title={isNight ? 'Switch to Daylight' : 'Switch to Night Lighting'}
        >
          {isNight ? <Moon className="w-3.5 h-3.5 text-teal-300" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
        </button>
      </div>

      {/* Floating Realm Resource & Stage Counter (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[#121215]/90 border border-[#27272a] backdrop-blur-sm text-xs font-semibold text-white shadow flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.accentColor }} />
          <span>{realmProg.resourceAmount}</span>
          <span className="text-[#a1a1aa] font-normal">{realmProg.resourceName}</span>
        </div>
      </div>

      {/* Bottom Stage Progression Bar */}
      <div className="absolute bottom-3 inset-x-3 z-20">
        <div className="px-3.5 py-2 rounded-lg bg-[#121215]/90 border border-[#27272a] backdrop-blur-sm flex flex-col gap-1.5 shadow">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#f4f4f5] font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{meta.stageNames[realmProg.growthStage - 1]}</span>
            </div>
            <span className="text-[#a1a1aa]">
              {realmProg.currentPoints} / {realmProg.pointsToNextStage} XP ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#27272a] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: meta.accentColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

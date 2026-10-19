import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  X, 
  Box, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Maximize2, 
  Eye, 
  Sparkles, 
  Plus, 
  Check, 
  ChevronUp, 
  ChevronDown,
  Compass,
  Play,
  Pause
} from 'lucide-react';
import { UdlOption } from '../types/lesson';

interface ThreeDLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUdlOption?: (option: UdlOption) => void;
}

export const ThreeDLabModal: React.FC<ThreeDLabModalProps> = ({
  isOpen,
  onClose,
  onAddUdlOption,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<'ecosystem' | 'cell' | 'molecule'>('ecosystem');
  const [exploded, setExploded] = useState<number>(0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'front'>('iso');

  // Three.js mutable state stored in refs to avoid re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameId = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<{ mesh: THREE.Object3D; originalY: number; explodeFactor: number }[]>([]);
  const materialsRef = useRef<THREE.Material[]>([]);

  // User drag rotation state
  const isDragging = useRef<boolean>(false);
  const prevMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationEuler = useRef<{ x: number; y: number }>({ x: 0.35, y: -0.6 });

  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900
    scene.fog = new THREE.FogExp2(0x0f172a, 0.035);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    // 3. Renderer setup with ACESFilmicToneMapping & PCFSoftShadowMap
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2); // Warm light
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.2); // Cool sky / warm ground
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xec4899, 1.0); // Vibrant rim accent
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // 6. Grounding Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    scene.add(shadowPlane);

    // Build the chosen 3D model
    buildModel(activeModel);

    // Mouse drag rotation listeners
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };
      rotationEuler.current.y += dx * 0.008;
      rotationEuler.current.x = Math.max(-0.8, Math.min(1.2, rotationEuler.current.x + dy * 0.008));
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (groupRef.current) {
        if (isRotating && !isDragging.current) {
          rotationEuler.current.y += 0.4 * dt;
        }
        // Damped rotation interpolation
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, rotationEuler.current.y, 8, dt);
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, rotationEuler.current.x, 8, dt);

        // Exploded view vertical separation with smooth damping
        partsRef.current.forEach(({ mesh, originalY, explodeFactor }) => {
          const targetY = originalY + (exploded / 100) * explodeFactor;
          mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 6, dt);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      // Clean up geometries and materials
      materialsRef.current.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [isOpen, activeModel]);

  // Model builder function with 3-12 composite parts & Studio PBR materials
  const buildModel = (modelType: 'ecosystem' | 'cell' | 'molecule') => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove old model group
    if (groupRef.current) {
      scene.remove(groupRef.current);
    }

    const group = new THREE.Group();
    groupRef.current = group;
    partsRef.current = [];
    materialsRef.current = [];

    if (modelType === 'ecosystem') {
      // 1. ECOSYSTEM TROPHIC PYRAMID & BIOME (Composite 8-part procedural model)
      
      // Layer 1: Soil & Decomposer Bed (Base Cylinder)
      const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.4, 32);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x451a03, // Rich soil
        roughness: 0.85,
        metalness: 0.05,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.2;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);
      partsRef.current.push({ mesh: baseMesh, originalY: 0.2, explodeFactor: -0.4 });
      materialsRef.current.push(baseMat);

      // Layer 2: Producers / Vegetative Canopy Layer
      const vegGeo = new THREE.CylinderGeometry(1.9, 2.3, 0.35, 32);
      const vegMat = new THREE.MeshStandardMaterial({
        color: 0x16a34a, // Vibrant producer green
        roughness: 0.6,
        metalness: 0.1,
      });
      const vegMesh = new THREE.Mesh(vegGeo, vegMat);
      vegMesh.position.y = 0.6;
      vegMesh.castShadow = true;
      group.add(vegMesh);
      partsRef.current.push({ mesh: vegMesh, originalY: 0.6, explodeFactor: 0.2 });
      materialsRef.current.push(vegMat);

      // Procedural Trees & Canopy Spores on Producer Tier
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const rad = 1.4;
        const treeTrunkGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.45, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
        const trunk = new THREE.Mesh(treeTrunkGeo, trunkMat);
        trunk.position.set(Math.cos(angle) * rad, 0.85, Math.sin(angle) * rad);
        
        const treeTopGeo = new THREE.ConeGeometry(0.28, 0.55, 8);
        const topMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
        const top = new THREE.Mesh(treeTopGeo, topMat);
        top.position.set(Math.cos(angle) * rad, 1.25, Math.sin(angle) * rad);
        top.castShadow = true;

        group.add(trunk);
        group.add(top);
        partsRef.current.push({ mesh: trunk, originalY: 0.85, explodeFactor: 0.2 });
        partsRef.current.push({ mesh: top, originalY: 1.25, explodeFactor: 0.2 });
      }

      // Layer 3: Primary Herbivore Consumers Tier
      const herbGeo = new THREE.CylinderGeometry(1.4, 1.8, 0.35, 32);
      const herbMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Amber herbivore tier
        roughness: 0.5,
        metalness: 0.2,
      });
      const herbMesh = new THREE.Mesh(herbGeo, herbMat);
      herbMesh.position.y = 1.05;
      herbMesh.castShadow = true;
      group.add(herbMesh);
      partsRef.current.push({ mesh: herbMesh, originalY: 1.05, explodeFactor: 0.8 });
      materialsRef.current.push(herbMat);

      // Layer 4: Secondary Carnivore Consumers Tier
      const carnGeo = new THREE.CylinderGeometry(0.9, 1.3, 0.35, 32);
      const carnMat = new THREE.MeshStandardMaterial({
        color: 0xe11d48, // Crimson carnivore tier
        roughness: 0.4,
        metalness: 0.3,
      });
      const carnMesh = new THREE.Mesh(carnGeo, carnMat);
      carnMesh.position.y = 1.45;
      carnMesh.castShadow = true;
      group.add(carnMesh);
      partsRef.current.push({ mesh: carnMesh, originalY: 1.45, explodeFactor: 1.4 });
      materialsRef.current.push(carnMat);

      // Layer 5: Apex Predator Pinnacle (Crystal Eagle / Prism)
      const apexGeo = new THREE.ConeGeometry(0.55, 0.6, 6);
      const apexMat = new THREE.MeshPhysicalMaterial({
        color: 0x8b5cf6, // Royal violet apex
        metalness: 0.7,
        roughness: 0.15,
        clearcoat: 1.0,
      });
      const apexMesh = new THREE.Mesh(apexGeo, apexMat);
      apexMesh.position.y = 1.95;
      apexMesh.castShadow = true;
      group.add(apexMesh);
      partsRef.current.push({ mesh: apexMesh, originalY: 1.95, explodeFactor: 2.1 });
      materialsRef.current.push(apexMat);

    } else if (modelType === 'cell') {
      // 2. EUKARYOTIC CELL 3D ANATOMY (Physical transmissive membrane + organelles)

      // Outer Transmissive Cytoplasm / Membrane (Cutaway Half Sphere)
      const cellGeo = new THREE.SphereGeometry(1.8, 36, 24, 0, Math.PI * 1.5, 0, Math.PI);
      const cellMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transmission: 0.75,
        opacity: 0.9,
        transparent: true,
        roughness: 0.2,
        ior: 1.4,
        thickness: 0.8,
        side: THREE.DoubleSide,
      });
      const cellMesh = new THREE.Mesh(cellGeo, cellMat);
      cellMesh.position.y = 1.2;
      group.add(cellMesh);
      partsRef.current.push({ mesh: cellMesh, originalY: 1.2, explodeFactor: 0.2 });
      materialsRef.current.push(cellMat);

      // Central Nucleus
      const nucleusGeo = new THREE.SphereGeometry(0.65, 32, 24);
      const nucleusMat = new THREE.MeshPhysicalMaterial({
        color: 0xa855f7,
        metalness: 0.2,
        roughness: 0.3,
        clearcoat: 0.9,
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.position.set(0.1, 1.2, 0);
      nucleusMesh.castShadow = true;
      group.add(nucleusMesh);
      partsRef.current.push({ mesh: nucleusMesh, originalY: 1.2, explodeFactor: 0.6 });
      materialsRef.current.push(nucleusMat);

      // Nucleolus core
      const nucleolusGeo = new THREE.SphereGeometry(0.25, 20, 16);
      const nucleolusMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });
      const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
      nucleolusMesh.position.set(0.2, 1.3, 0.15);
      group.add(nucleolusMesh);
      partsRef.current.push({ mesh: nucleolusMesh, originalY: 1.3, explodeFactor: 0.8 });

      // Mitochondria Organelles (PBR Torus & Capsules)
      const mitoPositions = [
        [-0.8, 0.7, 0.6],
        [0.8, 1.6, -0.4],
        [-0.6, 1.8, 0.5],
      ];
      mitoPositions.forEach(([x, y, z]) => {
        const mitoGeo = new THREE.CapsuleGeometry(0.15, 0.35, 12, 16);
        const mitoMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.2 });
        const mito = new THREE.Mesh(mitoGeo, mitoMat);
        mito.position.set(x, y, z);
        mito.rotation.z = Math.PI / 4;
        mito.castShadow = true;
        group.add(mito);
        partsRef.current.push({ mesh: mito, originalY: y, explodeFactor: 1.2 });
        materialsRef.current.push(mitoMat);
      });

    } else {
      // 3. KINEMATIC MOLECULAR LATTICE (Atoms & Valence Bond Cylinders)
      const centralAtomGeo = new THREE.SphereGeometry(0.6, 32, 24);
      const centralMat = new THREE.MeshPhysicalMaterial({
        color: 0xef4444, // Red Oxygen
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
      });
      const centralAtom = new THREE.Mesh(centralAtomGeo, centralMat);
      centralAtom.position.set(0, 1.4, 0);
      centralAtom.castShadow = true;
      group.add(centralAtom);
      partsRef.current.push({ mesh: centralAtom, originalY: 1.4, explodeFactor: 0.1 });
      materialsRef.current.push(centralMat);

      // 4 Surrounding Atoms (Tetrahedral Lattice)
      const coords = [
        [1.2, 0.6, 0.8, 0x3b82f6],
        [-1.2, 0.6, 0.8, 0x10b981],
        [0, 2.3, -1.1, 0xf59e0b],
        [0, 0.4, -1.3, 0x8b5cf6],
      ];

      coords.forEach(([x, y, z, col], idx) => {
        const atomGeo = new THREE.SphereGeometry(0.38, 24, 20);
        const atomMat = new THREE.MeshStandardMaterial({ color: col as number, metalness: 0.6, roughness: 0.25 });
        const atom = new THREE.Mesh(atomGeo, atomMat);
        atom.position.set(x, y, z);
        atom.castShadow = true;
        group.add(atom);
        partsRef.current.push({ mesh: atom, originalY: y, explodeFactor: 1.5 });
        materialsRef.current.push(atomMat);

        // Valence Bond Cylinder linking center to outer atom
        const bondGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12);
        const bondMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
        const bond = new THREE.Mesh(bondGeo, bondMat);
        bond.position.set(x / 2, (y + 1.4) / 2, z / 2);
        bond.lookAt(x, y, z);
        bond.rotateX(Math.PI / 2);
        group.add(bond);
        partsRef.current.push({ mesh: bond, originalY: (y + 1.4) / 2, explodeFactor: 0.7 });
        materialsRef.current.push(bondMat);
      });
    }

    scene.add(group);
  };

  // Wireframe toggle handler
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if ('wireframe' in mat) {
        (mat as any).wireframe = wireframe;
      }
    });
  }, [wireframe]);

  // Camera presets
  const handleSetCamera = (preset: 'iso' | 'top' | 'front') => {
    setCameraPreset(preset);
    if (!cameraRef.current) return;
    if (preset === 'top') {
      cameraRef.current.position.set(0, 7.5, 0.01);
      rotationEuler.current = { x: 0, y: 0 };
    } else if (preset === 'front') {
      cameraRef.current.position.set(0, 1.4, 7.5);
      rotationEuler.current = { x: 0, y: 0 };
    } else {
      cameraRef.current.position.set(0, 3.2, 7.5);
      rotationEuler.current = { x: 0.35, y: -0.6 };
    }
  };

  const handleAddAsUdlResource = () => {
    const opt: UdlOption = {
      id: `3d-res-${Date.now()}`,
      title: `Interactive 3D ${activeModel === 'ecosystem' ? 'Trophic Pyramid' : activeModel === 'cell' ? 'Eukaryotic Cell' : 'Molecular Geometry'} Model`,
      principle: 'representation',
      purpose: 'Enables tactile, rotational, and cross-sectional 3D exploration of complex spatial structures.',
      barrierAddressed: 'Static 2D diagram limitations and visual spatial comprehension hurdles.',
      learnerPathway: 'Students manipulate 3D models with zero-occlusion camera rotation and exploded-view layers.',
      teacherImplementation: 'Project onto classroom screen or share student-facing WebGL link for hands-on inquiry.',
      materials: ['Universal Design Lesson Planner Three.js Spatial Lab'],
      goalPreserved: true,
      goalDriftRisk: 'low',
      selected: true,
      clear: {
        connectedToGoal: 4,
        learningPreserving: 4,
        equitableAccess: 4,
        authenticEvidence: 4,
        realisticReady: 4,
        total: 20,
        status: 'READY',
        feedback: 'Superb tactile & perceptual UDL representation that preserves scientific rigor.'
      }
    };
    onAddUdlOption?.(opt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-6xl h-[92vh] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Minimal Spec Bar (Top-Left & Top-Right) */}
        <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-lg pointer-events-auto">
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
              3D
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-tight leading-none">
                Three.js Spatial Learning Lab
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                PBR Studio Lighting • Procedural 3D Assets • Zero Viewport Occlusion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 100% Unobstructed 3D WebGL Canvas Viewport */}
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          title="Click and drag to rotate the 3D model"
        />

        {/* Unified Bottom Control Dock (Zero Viewport Occlusion) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl pointer-events-auto transition-transform duration-300">
          
          {/* Dock Collapse / Expand Tab */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-3 py-1 rounded-t-lg bg-slate-800/95 border-t border-x border-slate-700 text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 shadow-md cursor-pointer"
            >
              {showControls ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              <span>{showControls ? 'Hide Controls' : 'Show 3D Controls'}</span>
            </button>
          </div>

          {/* Collapsible Dock Container */}
          {showControls && (
            <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl text-xs text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                
                {/* 1. Model Selector Tabs */}
                <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveModel('ecosystem')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeModel === 'ecosystem' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ecosystem Pyramid
                  </button>
                  <button
                    onClick={() => setActiveModel('cell')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeModel === 'cell' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cell Biology
                  </button>
                  <button
                    onClick={() => setActiveModel('molecule')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      activeModel === 'molecule' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Molecular Lattice
                  </button>
                </div>

                {/* 2. Exploded View Slider */}
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                  <Sliders className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-[11px] text-slate-300 font-semibold">Exploded:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={exploded}
                    onChange={(e) => setExploded(Number(e.target.value))}
                    className="w-20 md:w-28 accent-orange-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 w-6 font-mono">{exploded}%</span>
                </div>

                {/* 3. Camera Presets */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSetCamera('iso')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      cameraPreset === 'iso' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Isometric
                  </button>
                  <button
                    onClick={() => handleSetCamera('top')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      cameraPreset === 'top' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Top
                  </button>
                  <button
                    onClick={() => handleSetCamera('front')}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      cameraPreset === 'front' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Front
                  </button>
                </div>

                {/* 4. Toggles & Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRotating(!isRotating)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    title={isRotating ? 'Pause auto-rotation' : 'Start auto-rotation'}
                  >
                    {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setWireframe(!wireframe)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      wireframe ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Wireframe
                  </button>

                  <button
                    onClick={handleAddAsUdlResource}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert into Lesson</span>
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

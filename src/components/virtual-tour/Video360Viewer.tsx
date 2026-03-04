"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { VirtualTourHotspot } from "@/types/tour";

interface Video360ViewerProps {
  videoUrl: string;
  hotspots: VirtualTourHotspot[];
  audioEnabled: boolean;
  onHotspotClick: (hotspot: VirtualTourHotspot) => void;
  onYawChange?: (yaw: number) => void;
}

export default function Video360Viewer({
  videoUrl,
  hotspots,
  audioEnabled,
  onHotspotClick,
  onYawChange,
}: Video360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animFrameRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ lon: 0, lat: 0 });
  const hotspotMeshesRef = useRef<{ mesh: THREE.Mesh; hotspot: VirtualTourHotspot }[]>([]);

  const getYawFromLon = useCallback((lon: number) => lon % 360, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.01);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 360 video sphere (inverted normals)
    const videoEl = document.createElement("video");
    videoEl.src = videoUrl;
    videoEl.crossOrigin = "anonymous";
    videoEl.loop = true;
    videoEl.muted = !audioEnabled;
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    videoRef.current = videoEl;

    const texture = new THREE.VideoTexture(videoEl);
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // flip inside-out so we see video from inside

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Hotspot sprites
    hotspots.forEach((h) => {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: createHotspotTexture(h.type),
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(12, 12, 1);

      // Convert pitch/yaw to 3D cartesian on sphere surface
      const pitch = (h.pitch ?? 0) * (Math.PI / 180);
      const yaw = (h.yaw ?? 0) * (Math.PI / 180);
      const r = 490;
      sprite.position.set(
        r * Math.cos(pitch) * Math.sin(yaw),
        r * Math.sin(pitch),
        r * Math.cos(pitch) * Math.cos(yaw)
      );

      scene.add(sprite);
      // We need to use a fake Mesh for raycasting since Sprite raycasting is tricky
      const hitGeo = new THREE.PlaneGeometry(15, 15);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(sprite.position);
      hitMesh.lookAt(0, 0, 0);
      scene.add(hitMesh);
      hotspotMeshesRef.current.push({ mesh: hitMesh, hotspot: h });
    });

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const lat = Math.max(-85, Math.min(85, rotationRef.current.lat));
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(rotationRef.current.lon);

      camera.target = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(camera.target);

      onYawChange?.(getYawFromLon(rotationRef.current.lon));

      renderer.render(scene, camera);
    };
    animate();

    // Start video
    videoEl.play().catch(() => {});

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      videoEl.pause();
      videoEl.src = "";
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

  // Sync muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !audioEnabled;
    }
  }, [audioEnabled]);

  // Mouse/touch drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    const pos = "touches" in e ? e.touches[0] : e;
    prevMouseRef.current = { x: pos.clientX, y: pos.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const pos = "touches" in e ? e.touches[0] : e;
    const dx = pos.clientX - prevMouseRef.current.x;
    const dy = pos.clientY - prevMouseRef.current.y;
    rotationRef.current.lon -= dx * 0.15;
    rotationRef.current.lat += dy * 0.15;
    prevMouseRef.current = { x: pos.clientX, y: pos.clientY };
  }, []);

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      isDraggingRef.current = false;

      // Click detection (minimal movement)
      if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
        handleClick(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleClick = (e: React.MouseEvent) => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!container || !renderer || !camera) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(
      hotspotMeshesRef.current.map((h) => h.mesh)
    );
    if (hits.length > 0) {
      const found = hotspotMeshesRef.current.find((h) => h.mesh === hits[0].object);
      if (found) onHotspotClick(found.hotspot);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => { isDraggingRef.current = false; }}
      onTouchStart={onMouseDown}
      onTouchMove={onMouseMove}
      onTouchEnd={() => { isDraggingRef.current = false; }}
    />
  );
}

// Create colored canvas texture for hotspot sprites
function createHotspotTexture(type: VirtualTourHotspot["type"]): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  const colors: Record<string, string> = {
    info: "#3b82f6",
    audio: "#22c55e",
    video: "#ef4444",
    image: "#f59e0b",
    link: "#a855f7",
    effect: "#ec4899",
  };

  const color = colors[type] ?? "#ffffff";

  // Outer glow
  const gradient = ctx.createRadialGradient(32, 32, 8, 32, 32, 30);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  // Circle
  ctx.beginPath();
  ctx.arc(32, 32, 16, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

// Augment THREE camera to support .target
declare module "three" {
  interface PerspectiveCamera {
    target: THREE.Vector3;
  }
}

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GoldScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a04, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Soft gold ambient + spotlights (stage feel)
    const ambient = new THREE.AmbientLight(0x1a3d1a, 0.6);
    scene.add(ambient);

    const spotL = new THREE.SpotLight(0xffd700, 2.2, 40, Math.PI / 5, 0.4);
    spotL.position.set(-6, 8, 4);
    scene.add(spotL);

    const spotR = new THREE.SpotLight(0xffc857, 2.0, 40, Math.PI / 5, 0.4);
    spotR.position.set(6, 8, 4);
    scene.add(spotR);

    // Particle field
    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      speeds[i] = 0.002 + Math.random() * 0.006;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Subtle waveform rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(2.2 + i * 0.7, 0.012, 8, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc9a227,
        transparent: true,
        opacity: 0.18 - i * 0.04,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.4;
      ring.position.y = -1.5;
      scene.add(ring);
      rings.push(ring);
    }

    let frame = 0;
    let raf = 0;

    const animate = () => {
      frame += 1;
      const pos = geometry.attributes.position as THREE.BufferAttribute;

      for (let i = 0; i < COUNT; i++) {
        const y = pos.getY(i) + speeds[i];
        pos.setY(i, y > 8 ? -8 : y);
        const x = pos.getX(i) + Math.sin(frame * 0.002 + i) * 0.0015;
        pos.setX(i, x);
      }
      pos.needsUpdate = true;

      points.rotation.y = frame * 0.00035;
      rings.forEach((ring, i) => {
        ring.rotation.z = frame * 0.001 * (i % 2 === 0 ? 1 : -1);
        ring.scale.setScalar(1 + Math.sin(frame * 0.01 + i) * 0.04);
      });

      camera.position.x = Math.sin(frame * 0.0008) * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}

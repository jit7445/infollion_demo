"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars, Float, PerspectiveCamera, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function GlobeConnections() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const points = useMemo(() => {
    const pts = [];
    const count = 40; // More points for a dense network
    for (let i = 0; i < count; i++) {
       // Using Fibonacci sphere distribution for uniform points
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      pts.push(new THREE.Vector3().setFromSphericalCoords(2.2, phi, theta));
    }
    return pts;
  }, []);

  const lines = useMemo(() => {
    const lns = [];
    for (let i = 0; i < points.length; i++) {
      const neighbors = points
        .map((p, idx) => ({ p, idx, dist: p.distanceTo(points[i]) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(1, 4);

      for (const neighbor of neighbors) {
        if (Math.random() > 0.4) {
          const start = points[i];
          const end = neighbor.p;
          const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(2.6);
          const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
          lns.push({
            points: curve.getPoints(30),
          });
        }
      }
    }
    return lns;
  }, [points]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth continuous rotation
      groupRef.current.rotation.y += 0.0015;
      groupRef.current.rotation.z += 0.0005;
    }
  });

  // Colors based on theme
  const sphereColor = isDark ? "#001a2c" : "#d1d5db"; // Deep Navy vs Gray (gray-300)
  const emissiveColor = isDark ? "#003554" : "#9ca3af"; // Navy Emissive vs Gray (gray-400)
  const wireframeColor = isDark ? "#00a8ff" : "#6b7280"; // Blue vs Gray (gray-500)
  const accentColor = isDark ? "#ff7e32" : "#ec9324"; // Keep orange accents but maybe slightly adjust

  return (
    <group ref={groupRef}>
      {/* 1. Base Sphere */}
      <Sphere args={[2.18, 64, 64]}>
        <meshStandardMaterial 
          color={sphereColor}
          emissive={emissiveColor} 
          emissiveIntensity={isDark ? 0.5 : 0.2}
          metalness={isDark ? 0.8 : 0.1}
          roughness={isDark ? 0.2 : 0.8}
          transparent
          opacity={isDark ? 0.7 : 0.9}
        />
      </Sphere>
      
      {/* 2. Global Wireframe Overlay */}
      <Sphere args={[2.2, 32, 16]}>
        <meshBasicMaterial 
          color={wireframeColor} 
          wireframe 
          transparent 
          opacity={isDark ? 0.08 : 0.15} 
        />
      </Sphere>

      {/* 3. Connection Lines */}
      {lines.map((ln, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry" onUpdate={(self) => self.setFromPoints(ln.points)} />
          <lineBasicMaterial attach="material" color={accentColor} transparent opacity={isDark ? 0.3 : 0.5} linewidth={1} />
        </line>
      ))}

      {/* 4. Glowing Nodes */}
      {points.map((pt, j) => (
        <group key={j} position={pt}>
          {/* Core point */}
          <mesh>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
          {/* Node Glow */}
          <mesh scale={[2.5, 2.5, 2.5]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={accentColor} transparent opacity={isDark ? 0.15 : 0.25} />
          </mesh>
          {/* Outer Ring Glow */}
          <mesh scale={[5, 5, 5]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={accentColor} transparent opacity={isDark ? 0.05 : 0.1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function NetworkGlobe() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6.5]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00a8ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff7e32" />
        
        {/* Particle Background */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.2} />
        
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
          <GlobeConnections />
        </Float>
      </Canvas>
    </div>
  );
}

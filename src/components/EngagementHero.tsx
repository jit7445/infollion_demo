"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  RoundedBox, 
  MeshDistortMaterial, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Html
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Users, UserPlus, Plane, Sparkles } from "lucide-react";

const MODES = [
  { id: "calls", label: "Calls", num: "01", icon: <Phone className="w-5 h-5" />, color: "#8B6F4E", position: [1.3, -0.4, 0] },
  { id: "sit-ins", label: "Sit-Ins", num: "02", icon: <Users className="w-5 h-5" />, color: "#5D4B33", position: [0.3, 0.7, 0] },
  { id: "pexpanel", label: "PexPanel", num: "03", icon: <UserPlus className="w-5 h-5" />, color: "#7A6348", position: [-1.3, 0.1, 0] },
  { id: "tours", label: "Tours", num: "04", icon: <Plane className="w-5 h-5" />, color: "#A67C52", position: [-0.3, -0.9, 0] },
];

function InteractiveBall({ mode, onSelect, activeId }: { mode: typeof MODES[0], onSelect: (id: string) => void, activeId: string | null }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isActive = activeId === mode.id;

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
      mesh.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group position={new THREE.Vector3(...mode.position)}>
        <RoundedBox
          ref={mesh}
          args={[1.6, 1.6, 0.4]}
          radius={0.3}
          smoothness={4}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => onSelect(mode.id)}
          scale={hovered ? 1.1 : 1}
        >
          <meshStandardMaterial
            color={hovered || mode.id === "sit-ins" ? "#FF7A30" : "#1A1208"}
            roughness={0.1}
            metalness={0.8}
            emissive={hovered || mode.id === "sit-ins" ? "#FF7A30" : "#000"}
            emissiveIntensity={hovered ? 0.4 : 0.1}
          />
        </RoundedBox>
        
        {/* Icon & Label */}
        <Html position={[0, 0, 0.25]} center transform distanceFactor={5}>
          <div 
            className={`flex flex-col items-center gap-2 transition-all duration-500 pointer-events-none select-none`}
            style={{ color: (hovered || mode.id === "sit-ins") ? "#fff" : "#FF7A30" }}
          >
            <div className="scale-125 mb-1">
              {mode.icon}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-80">
                {mode.label}
              </span>
              <span className="text-[12px] font-black opacity-40">
                {mode.num}
              </span>
            </div>
          </div>
        </Html>

        {/* Glow effect */}
        <pointLight 
          color={mode.color} 
          intensity={hovered ? 15 : 2} 
          distance={isActive ? 20 : 5} 
          decay={2}
        />
      </group>
    </Float>
  );
}

export function EngagementHero() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isBlasting, setIsBlasting] = useState(false);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setIsBlasting(true);
    
    // Blast animation timing
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(() => {
        setIsBlasting(false);
        setActiveId(null);
      }, 1000);
    }, 600);
  };

  return (
    <section className="relative w-full h-[95vh] flex flex-col items-center justify-start pt-24 overflow-hidden bg-[#FDFCF7]">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Title Area */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full px-6 py-2 border border-brand-primary/20 bg-brand-primary/5"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-primary">
            MODES OF ENGAGEMENT
          </span>
        </motion.div>
        


        <p className="max-w-2xl mx-auto text-lg text-brand-text/50 leading-relaxed font-light">
          From a 30-minute precision call to a multi-day on-site research tour — choose how deep you want to go.
        </p>

        <div className="mt-16 text-[10px] uppercase tracking-[0.5em] font-bold opacity-30">
          Click any sphere to explore
        </div>
      </div>

      {/* 3D Scene - Clustered at bottom */}
      <div className="absolute inset-0 top-[40%] w-full h-[60%] cursor-grab active:cursor-grabbing">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={1} />
          
          <Environment preset="city" />

          {MODES.map((mode) => (
            <InteractiveBall 
              key={mode.id} 
              mode={mode} 
              onSelect={handleSelect} 
              activeId={activeId}
            />
          ))}

          <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Canvas>
      </div>

      {/* Blast Overlay */}
      <AnimatePresence>
        {isBlasting && activeId && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 50, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "circIn" }}
            className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center"
          >
            <div 
              className="w-10 h-10 rounded-full"
              style={{ 
                backgroundColor: MODES.find(m => m.id === activeId)?.color,
                boxShadow: `0 0 100px 50px ${MODES.find(m => m.id === activeId)?.color}`
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 flex flex-col items-center gap-4 z-20">
        <div className="w-[1px] h-12 bg-brand-primary/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-4 bg-brand-primary/60"
          />
        </div>
        <span className="text-[9px] uppercase tracking-[0.5em] font-black opacity-40">Scroll</span>
      </div>
    </section>
  );
}

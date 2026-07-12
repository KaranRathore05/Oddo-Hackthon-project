import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A moving highway grid effect
function HighwayGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (gridRef.current) {
      // Move the grid towards the camera to simulate driving
      gridRef.current.position.z += delta * 15;
      if (gridRef.current.position.z > 20) {
        gridRef.current.position.z = 0;
      }
    }
  });

  const lines = useMemo(() => {
    const l = [];
    // Vertical lines (lanes)
    for (let i = -20; i <= 20; i += 2) {
      l.push([new THREE.Vector3(i, 0, -100), new THREE.Vector3(i, 0, 50)]);
    }
    // Horizontal lines (speed indicators)
    for (let i = -100; i <= 50; i += 5) {
      l.push([new THREE.Vector3(-20, 0, i), new THREE.Vector3(20, 0, i)]);
    }
    return l;
  }, []);

  return (
    <group ref={gridRef} position={[0, -2, -50]}>
      {lines.map((pts, i) => (
        <Line 
          key={i} 
          points={pts} 
          color="#00D4FF" 
          opacity={0.15} 
          transparent 
          lineWidth={1}
        />
      ))}
    </group>
  );
}

// Glowing GPS nodes / Vehicles
function MovingVehicles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  const [positions, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const colorOptions = [new THREE.Color('#00D4FF'), new THREE.Color('#FFB800'), new THREE.Color('#FF3366')];
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40; // x
      pos[i * 3 + 1] = (Math.random() * 2) - 1.5; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20; // z
      
      spd[i] = Math.random() * 20 + 10; // speed
      
      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, spd, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        posAttr.setZ(i, posAttr.getZ(i) + speeds[i] * delta);
        if (posAttr.getZ(i) > 20) {
          posAttr.setZ(i, -100);
          posAttr.setX(i, (Math.random() - 0.5) * 40);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial 
        transparent 
        vertexColors 
        size={0.2} 
        sizeAttenuation={true} 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Dust particles for volumetric feel
function AmbientDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial transparent color="#ffffff" size={0.05} opacity={0.3} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

// Camera rig that responds to scroll and mouse
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Setup GSAP ScrollTrigger to move camera Z position based on page scroll
    // This makes the camera "fly" through the scene as you scroll down
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth scrubbing
      onUpdate: (self) => {
        // Move camera forward by up to 50 units based on scroll progress
        gsap.to(camera.position, {
          z: 10 - self.progress * 40,
          y: 2 + self.progress * 2, // Slightly rise up
          ease: 'power2.out',
          duration: 0.5
        });
        
        // Tilt camera down slightly as we move forward
        gsap.to(camera.rotation, {
          x: -self.progress * 0.2,
          ease: 'power2.out',
          duration: 0.5
        });
      }
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      st.kill();
    };
  }, [camera]);

  useFrame((state, delta) => {
    // Subtle parallax based on mouse
    camera.position.x += (mouse.current.x * 2 - camera.position.x) * delta * 2;
    // Don't override Y heavily since GSAP controls it, just add a tiny offset
  });

  return null;
}

export function Hero3DScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-charcoal">
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <fog attach="fog" args={['#0A0A0F', 10, 60]} />
        <ambientLight intensity={0.2} />
        
        <HighwayGrid />
        <MovingVehicles />
        <AmbientDust />
        
        <CameraRig />
      </Canvas>
      
      {/* Vignette overlay for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0F_100%)] opacity-80 pointer-events-none" />
    </div>
  );
}

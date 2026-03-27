import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const accentColorRef = useRef(new THREE.Color('#60a5fa'));

  useEffect(() => {
    const updateColor = () => {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (accentColor) {
        accentColorRef.current.set(accentColor);
      }
    };
    
    updateColor();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
    
    return () => observer.disconnect();
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Deep parallax mouse effect (X, Y, and Z)
      const targetX = state.mouse.x * 2.5;
      const targetY = state.mouse.y * 2.5;
      const targetZ = -Math.abs(state.mouse.x * state.mouse.y) * 2; // Pushes back when moving to corners
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.05);
      
      // Dynamic scale pulse based on mouse velocity/position
      const mouseDist = Math.sqrt(state.mouse.x ** 2 + state.mouse.y ** 2);
      const targetScale = 2.6 + mouseDist * 0.4;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05));

      // Rotation follows mouse with a subtle lag and "tilt"
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY * 0.5 + time * 0.1, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX * 0.5 + time * 0.15, 0.05);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, state.mouse.x * state.mouse.y * 0.2, 0.05);
    }

    // Sync color from ref with a subtle shift based on mouse position
    if (materialRef.current) {
      const shiftColor = accentColorRef.current.clone();
      shiftColor.lerp(new THREE.Color(state.mouse.x > 0 ? '#ffffff' : '#000000'), 0.05);
      materialRef.current.color.copy(shiftColor);
      // React distortion to mouse position
      materialRef.current.distort = 0.3 + (Math.abs(state.mouse.x) + Math.abs(state.mouse.y)) * 0.2;
    }
  });

  return (
    <Float speed={4} rotationIntensity={1.5} floatIntensity={2.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.6}>
        <MeshDistortMaterial
          ref={materialRef}
          distort={0.4}
          speed={5}
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>
    </Float>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}

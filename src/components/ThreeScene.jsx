import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

function FloatingTorusKnot() {
    const meshRef = useRef();
    const materialRef = useRef();

    // Create gradient color for iridescence
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.elapsedTime;

        // Slow elegant rotation
        meshRef.current.rotation.x = t * 0.08;
        meshRef.current.rotation.y = t * 0.12;
        meshRef.current.rotation.z = Math.sin(t * 0.05) * 0.1;

        // Subtle breathing scale
        const breathe = 1 + Math.sin(t * 0.6) * 0.02;
        meshRef.current.scale.setScalar(breathe);
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <torusKnotGeometry args={[1, 0.35, 256, 64]} />
            <meshPhysicalMaterial
                ref={materialRef}
                color="#1a1a2e"
                roughness={0.15}
                metalness={0.8}
                transmission={0.6}
                thickness={0.5}
                ior={1.5}
                iridescence={1.0}
                iridescenceIOR={1.3}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                envMapIntensity={1.5}
                transparent
                opacity={0.9}
            />
        </mesh>
    );
}

function CameraRig({ scrollProgress = 0 }) {
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Handheld camera breathing
        const breathX = Math.sin(t * 0.4) * 0.05;
        const breathY = Math.cos(t * 0.3) * 0.04;

        // Scroll-driven camera push
        const zOffset = scrollProgress * -3;
        const rotY = scrollProgress * Math.PI * 0.3;

        state.camera.position.x = breathX + Math.sin(rotY) * 3;
        state.camera.position.y = breathY + 0.5;
        state.camera.position.z = 4 + zOffset + Math.cos(rotY) * 1;
        state.camera.lookAt(0, 0, 0);
    });

    return null;
}

export default function ThreeScene({ scrollProgress = 0 }) {
    return (
        <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0.5, 4], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2,
                }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
            >
                {/* 3-Point Lighting */}
                <directionalLight
                    color="#00d4ff"
                    intensity={3}
                    position={[5, 5, 5]}
                    castShadow
                />
                <pointLight
                    color="#8B5CF6"
                    intensity={4}
                    position={[-5, -3, 2]}
                    distance={15}
                />
                <pointLight
                    color="#ffffff"
                    intensity={0.4}
                    position={[0, 3, -5]}
                    distance={20}
                />

                {/* Ambient fill */}
                <ambientLight intensity={0.08} />

                <FloatingTorusKnot />
                <CameraRig scrollProgress={scrollProgress} />

                <Environment preset="night" />
            </Canvas>
        </div>
    );
}

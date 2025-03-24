import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeProps {
  options: {
    lightColor1: number;
    lightColor2: number;
    oceanColor: number;
    dotsColor: number;
    atmosphereColor: string;
  };
}

export const Globe = ({ options }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const sphereRef = useRef<THREE.Mesh>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    scene.background = null;
    container.appendChild(renderer.domElement);

    // Lights
    const light1 = new THREE.PointLight(options.lightColor1, 3.0);
    light1.position.set(-100, 100, 100);

    const light2 = new THREE.PointLight(options.lightColor2, 2.5);
    light2.position.set(100, 100, 100);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    
    scene.add(light1, light2, ambientLight);

    // Atmosphere
    const atmosphereShader = {
      'atmosphere': {
        uniforms: {},
        vertexShader: [
          'varying vec3 vNormal;',
          'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          '}'
        ].join('\n'),
        fragmentShader: [
          'varying vec3 vNormal;',
          'void main() {',
          'float intensity = pow( 0.99 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 6.0 );',
          `gl_FragColor = vec4( ${options.atmosphereColor} ) * intensity;`,
          '}'
        ].join('\n')
      }
    };

    const atmosphereGeometry = new THREE.SphereGeometry(0.9, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(atmosphereShader['atmosphere'].uniforms),
      vertexShader: atmosphereShader['atmosphere'].vertexShader,
      fragmentShader: atmosphereShader['atmosphere'].fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atm = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atm.scale.set(1.05, 1.05, 1.05);
    atm.position.set(-.1, .1, 0);
    scene.add(atm);

    // Globe
    const sphereGeometry = new THREE.SphereGeometry(0.9, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: options.oceanColor,
      shininess: 5,
      specular: 0x444444,
      emissive: options.oceanColor,
      emissiveIntensity: 0.2
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    sphereRef.current = sphere;

    // Map overlay
    const loader = new THREE.TextureLoader();
    const overlayMaterial = new THREE.MeshPhongMaterial({
      map: loader.load('https://i.imgur.com/JLFp6Ws.png'),
      transparent: true,
      color: options.dotsColor,
      emissive: options.dotsColor,
      emissiveIntensity: 2.0,
      opacity: 1.0,
      shininess: 100,
      specular: options.dotsColor
    });

    const overlaySphereGeometry = new THREE.SphereGeometry(0.903, 64, 64);
    const overlaySphere = new THREE.Mesh(overlaySphereGeometry, overlayMaterial);
    overlaySphere.castShadow = true;
    overlaySphere.receiveShadow = true;
    sphere.add(overlaySphere);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 1.8;

    // Mouse event handlers
    const handleMouseDown = () => {
      isDraggingRef.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const deltaMove = { x: x - previousMousePositionRef.current.x };

      if (isDraggingRef.current && sphereRef.current) {
        sphereRef.current.rotation.y += deltaMove.x * .004;
      }

      previousMousePositionRef.current = { x };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleMouseOut = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseout', handleMouseOut);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      if (!isDraggingRef.current && sphereRef.current) {
        sphereRef.current.rotation.y += 0.0005;
      }
      renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    const handleResize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseout', handleMouseOut);
      container.removeChild(renderer.domElement);
    };
  }, [options]);

  return <div ref={containerRef} className="globeCanvas" />;
}; 
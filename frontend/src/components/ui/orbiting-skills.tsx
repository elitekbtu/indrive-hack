"use client"
import React, { useEffect, useState, memo } from 'react';

// --- Type Definitions ---
type IconType = 'pytorch' | 'opencv' | 'fastapi' | 'react' | 'docker' | 'typescript' | 'azure' | 'tailwind';

type GlowColor = 'cyan' | 'purple';

interface SkillIconProps {
  type: IconType;
}

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: IconType;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
}

interface OrbitingSkillProps {
  config: SkillConfig;
  angle: number;
}

interface GlowingOrbitPathProps {
  radius: number;
  glowColor?: GlowColor;
  animationDelay?: number;
}

// --- Technology Icon Components ---
const iconComponents: Record<IconType, { component: () => React.JSX.Element; color: string }> = {
  pytorch: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.5 2.5L20 6.5V17.5L12.5 21.5L5 17.5V6.5L12.5 2.5Z" fill="#EE4C2C"/>
        <path d="M12.5 3.5L19 6.5V17L12.5 20L6 17V6.5L12.5 3.5Z" fill="#FF6B35"/>
      </svg>
    ),
    color: '#EE4C2C'
  },
  opencv: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#5C3EE8"/>
        <circle cx="8" cy="8" r="3" fill="white"/>
        <circle cx="16" cy="16" r="3" fill="white"/>
      </svg>
    ),
    color: '#5C3EE8'
  },
  fastapi: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="#009688"/>
        <path d="M12 8L16 12L12 16L8 12L12 8Z" fill="white"/>
      </svg>
    ),
    color: '#009688'
  },
  react: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)"/>
        </g>
      </svg>
    ),
    color: '#61DAFB'
  },
  docker: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <rect x="2" y="10" width="4" height="3" fill="#2496ED"/>
        <rect x="6" y="10" width="4" height="3" fill="#2496ED"/>
        <rect x="10" y="10" width="4" height="3" fill="#2496ED"/>
        <rect x="6" y="7" width="4" height="3" fill="#2496ED"/>
        <rect x="10" y="7" width="4" height="3" fill="#2496ED"/>
        <rect x="14" y="10" width="4" height="3" fill="#2496ED"/>
        <path d="M20 10C20 8 18 7 16 7V10H20Z" fill="#2496ED"/>
      </svg>
    ),
    color: '#2496ED'
  },
  typescript: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#3178C6"/>
        <path d="M12 6V18M8 6H16M8 18H16" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    color: '#3178C6'
  },
  azure: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M3 12L12 3L21 12L12 21L3 12Z" fill="#0078D4"/>
        <path d="M12 5L18 12L12 19L6 12L12 5Z" fill="#00BCF2"/>
      </svg>
    ),
    color: '#0078D4'
  },
  tailwind: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#06B6D4"/>
      </svg>
    ),
    color: '#06B6D4'
  }
};

// --- Memoized Icon Component ---
const SkillIcon = memo(({ type }: SkillIconProps) => {
  const IconComponent = iconComponents[type]?.component;
  return IconComponent ? <IconComponent /> : null;
});
SkillIcon.displayName = 'SkillIcon';

// --- Configuration for the Orbiting Skills ---
const skillsConfig: SkillConfig[] = [
  // Inner Orbit - AI/ML Core
  { 
    id: 'pytorch',
    orbitRadius: 100, 
    size: 40, 
    speed: 1, 
    iconType: 'pytorch', 
    phaseShift: 0, 
    glowColor: 'cyan',
    label: 'PyTorch'
  },
  { 
    id: 'opencv',
    orbitRadius: 100, 
    size: 40, 
    speed: 1, 
    iconType: 'opencv', 
    phaseShift: (2 * Math.PI) / 3, 
    glowColor: 'cyan',
    label: 'OpenCV'
  },
  { 
    id: 'fastapi',
    orbitRadius: 100, 
    size: 40, 
    speed: 1, 
    iconType: 'fastapi', 
    phaseShift: (4 * Math.PI) / 3, 
    glowColor: 'cyan',
    label: 'FastAPI'
  },
  // Outer Orbit - Infrastructure & Frontend
  { 
    id: 'react',
    orbitRadius: 180, 
    size: 50, 
    speed: -0.6, 
    iconType: 'react', 
    phaseShift: 0, 
    glowColor: 'purple',
    label: 'React'
  },
  { 
    id: 'docker',
    orbitRadius: 180, 
    size: 45, 
    speed: -0.6, 
    iconType: 'docker', 
    phaseShift: (2 * Math.PI) / 3, 
    glowColor: 'purple',
    label: 'Docker'
  },
  { 
    id: 'typescript',
    orbitRadius: 180, 
    size: 45, 
    speed: -0.6, 
    iconType: 'typescript', 
    phaseShift: (4 * Math.PI) / 3, 
    glowColor: 'purple',
    label: 'TypeScript'
  },
  { 
    id: 'azure',
    orbitRadius: 180, 
    size: 40, 
    speed: -0.6, 
    iconType: 'azure', 
    phaseShift: (Math.PI), 
    glowColor: 'purple',
    label: 'Azure'
  },
  { 
    id: 'tailwind',
    orbitRadius: 180, 
    size: 40, 
    speed: -0.6, 
    iconType: 'tailwind', 
    phaseShift: (5 * Math.PI) / 3, 
    glowColor: 'purple',
    label: 'Tailwind CSS'
  },
];

// --- Memoized Orbiting Skill Component ---
const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-full h-full p-2 bg-gray-800/90 backdrop-blur-sm
          rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${isHovered ? 'scale-125 shadow-2xl' : 'shadow-lg hover:shadow-xl'}
        `}
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${iconComponents[iconType]?.color}40, 0 0 60px ${iconComponents[iconType]?.color}20`
            : undefined
        }}
      >
        <SkillIcon type={iconType} />
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900/95 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap pointer-events-none">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = 'OrbitingSkill';

// --- Optimized Orbit Path Component ---
const GlowingOrbitPath = memo(({ radius, glowColor = 'cyan', animationDelay = 0 }: GlowingOrbitPathProps) => {
  const glowColors = {
    cyan: {
      primary: 'rgba(6, 182, 212, 0.4)',
      secondary: 'rgba(6, 182, 212, 0.2)',
      border: 'rgba(6, 182, 212, 0.3)'
    },
    purple: {
      primary: 'rgba(147, 51, 234, 0.4)',
      secondary: 'rgba(147, 51, 234, 0.2)',
      border: 'rgba(147, 51, 234, 0.3)'
    }
  };

  const colors = glowColors[glowColor] || glowColors.cyan;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* Glowing background */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
          boxShadow: `0 0 60px ${colors.primary}, inset 0 0 60px ${colors.secondary}`,
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: `${animationDelay}s`,
        }}
      />

      {/* Static ring for depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${colors.border}`,
          boxShadow: `inset 0 0 20px ${colors.secondary}`,
        }}
      />
    </div>
  );
});
GlowingOrbitPath.displayName = 'GlowingOrbitPath';

// --- Main App Component ---
export default function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime(prevTime => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: 100, glowColor: 'cyan', delay: 0 },
    { radius: 180, glowColor: 'purple', delay: 1.5 }
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden py-4">
      {/* Title Section */}
      <div className="text-center mb-4 px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-black to-green-500 bg-clip-text text-transparent">
          Технологический Стек
        </h2>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #374151 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, #4B5563 0%, transparent 50%)`,
          }}
        />
      </div>

      <div 
        className="relative w-[calc(100vw-40px)] h-[calc(100vw-40px)] md:w-[450px] md:h-[450px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Central "Code" Icon with enhanced glow */}
        <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center z-10 relative shadow-2xl">
          <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-xl animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
              </defs>
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
        </div>

        {/* Render glowing orbit paths */}
        {orbitConfigs.map((config) => (
          <GlowingOrbitPath
            key={`path-${config.radius}`}
            radius={config.radius}
            glowColor={config.glowColor}
            animationDelay={config.delay}
          />
        ))}

        {/* Render orbiting skill icons */}
        {skillsConfig.map((config) => {
          const angle = time * config.speed + (config.phaseShift || 0);
          return (
            <OrbitingSkill
              key={config.id}
              config={config}
              angle={angle}
            />
          );
        })}
      </div>
    </div>
  );
}

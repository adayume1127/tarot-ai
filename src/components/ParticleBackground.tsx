'use client'

import { useCallback } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine } from '@tsparticles/engine'
import { ParticlesProvider } from '@tsparticles/react'

function ParticlesInner() {
  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 pointer-events-none z-0"
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
          number: { value: 120, density: { enable: true } },
          color: { value: ['#FFD700', '#C0A0FF', '#FFFFFF', '#FFB6C1'] },
          shape: { type: 'circle' },
          opacity: {
            value: { min: 0.1, max: 0.8 },
            animation: { enable: true, speed: 0.8, sync: false },
          },
          size: {
            value: { min: 0.5, max: 3 },
            animation: { enable: true, speed: 1.5, sync: false },
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            straight: false,
            outModes: 'out',
          },
          twinkle: {
            particles: { enable: true, frequency: 0.05, opacity: 1 },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'bubble' },
          },
          modes: {
            bubble: { distance: 100, size: 5, duration: 0.3, opacity: 1 },
          },
        },
        detectRetina: true,
      }}
    />
  )
}

export default function ParticleBackground() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <ParticlesProvider init={init}>
      <ParticlesInner />
    </ParticlesProvider>
  )
}

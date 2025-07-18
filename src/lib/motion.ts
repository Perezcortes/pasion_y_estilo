import { Variants } from 'framer-motion'

export const staggerContainer = (
  staggerChildren?: number, 
  delayChildren?: number
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0
    }
  }
})

export const fadeIn = (
  direction: 'up' | 'down' | 'left' | 'right', 
  type: 'tween' | 'spring' | 'keyframes' | 'inertia' | undefined, 
  delay: number, 
  duration: number
): Variants => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: type || 'spring',
      delay: delay || 0,
      duration: duration || 1,
      ease: [0.25, 0.25, 0.75, 0.75] // Valor de ease específico en lugar de string
    }
  }
})